from typing import List, Dict, Any, Optional
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate, ChatPromptTemplate
from langchain.schema import HumanMessage, SystemMessage
from ..config.settings import settings
from .vector_db_service import VectorDBService
from langchain.agents import AgentExecutor, create_tool_calling_agent
import json
from ..utils.response_utils import ResponseUtils
from ..models.schemas import ChatData
from ..tools.strapi_cms import create_note

class RAGService:
    def __init__(self):
        self.llm = ChatOpenAI(
            openai_api_key=settings.OPENAI_API_KEY,
            model_name=settings.LLM_MODEL,
            temperature=settings.LLM_TEMPERATURE,
            max_tokens=settings.MAX_TOKENS
        )
        
        self.vector_db_service = VectorDBService()

        self.rag_template = """Eres un asistente multilingüe especializado en responder preguntas basándose únicamente en el contexto proporcionado.

Contexto relevante:
{context}

Pregunta: {question}

Instrucciones:
- Responde únicamente basándote en la información del contexto proporcionado
- Si la información no está en el contexto, di claramente que no tienes esa información
- Sé preciso y conciso en tu respuesta
- Si hay múltiples fuentes en el contexto, puedes combinar la información
- Mantén un tono profesional y útil
- Si el usuario solicita crear una nota, puedes usar la herramienta disponible para hacerlo

Respuesta:"""


        self.prompt_template = PromptTemplate(
            template=self.rag_template,
            input_variables=["context", "question"]
        )
        self.tools = [create_note]

        self.agent_prompt = ChatPromptTemplate.from_messages([
            ("system", """Eres un asistente multilingüe especializado en responder preguntas basándose en el contexto proporcionado.

Tienes acceso a herramientas que puedes usar cuando sea apropiado.

Instrucciones:
- Responde basándote en la información del contexto proporcionado cuando esté disponible
- Si la información no está en el contexto, di claramente que no tienes esa información
- Si el usuario solicita crear, guardar o almacenar una nota, usa la herramienta create_note
- Mantén un tono profesional y útil
- Sé preciso y conciso en tus respuestas"""),
            ("human", "{input}"),
            ("placeholder", "{agent_scratchpad}"),
        ])

        # ========
        self.agent = create_tool_calling_agent(
            llm=self.llm, 
            tools=self.tools, 
            prompt=self.agent_prompt
        )
        self.agent_executor = AgentExecutor(
            agent=self.agent, 
            tools=self.tools, 
            verbose=True
        )
    
    async def query_documents(self, question: str, file_id: Optional[int] = None, max_chunks: int = None):
        try:
            if max_chunks is None:
                max_chunks = settings.MAX_CONTEXT_CHUNKS
            
            relevant_docs = await self.vector_db_service.similarity_search_with_scores(
                query=question,
                k=max_chunks,
                file_id=file_id
            )

            print(relevant_docs)
            
            if not relevant_docs:
                data = ChatData(answer="No encontré información relevante para responder tu pregunta.")
                return 200, ResponseUtils.success(data=data, message="Assintan responded successfully")
            
            
            context = self._build_context(relevant_docs)
            
            prompt = self.prompt_template.format(
                context=context,
                question=question
            )

            result = self.agent_executor.invoke({"input": prompt})
            response = result['output']
            
            data = ChatData(answer=response)
        
            return 200, ResponseUtils.success(data=data, message="Assintan responded successfully")
            
        except Exception as e:
            return 500, ResponseUtils.error(
                error="CHAT_ERROR",
                message=f"Error when querying documents: {str(e)}"  
            )
    
    async def generate_llm_response(self, prompt: str) -> str:
        try:
            messages = [HumanMessage(content=prompt)]
            response = await self.llm.ainvoke(messages)
            return response.content.strip()
        except Exception as e:
            raise Exception(f"Error when generating LLM response: {str(e)}")
    
    def _build_context(self, relevant_docs: List[Dict[str, Any]]) -> str:
        context_parts = []
        for i, doc in enumerate(relevant_docs, 1):
            context_parts.append(
                f"Fuente {i}:\n{doc['content']}\n"
            )
        context = "\n".join(context_parts)
        print('CONTEXT', context)
        return context