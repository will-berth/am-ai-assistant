# 🤖 Sistema RAG Inteligente con Strapi

Un sistema completo de Retrieval-Augmented Generation (RAG) que permite procesar documentos, generar embeddings vectoriales y proporcionar respuestas contextuales mediante integración con OpenAI y herramientas personalizadas a través de Strapi CMS.

## 🚀 Características Principales

- **📄 Procesamiento de Documentos**: Chunking inteligente de documentos para optimizar la recuperación de información
- **🔍 Embeddings Vectoriales**: Generación y almacenamiento de embeddings usando ChromaDB para búsqueda semántica
- **🛠️ Ejecución de Tools por Chat**: Activación automática de herramientas mediante lenguaje natural (ej: "créame una nota con las ciudades que son cálidas")
- **💬 Chat Inteligente**: Interfaz conversacional con OpenAI enriquecida con contexto relevante
- **⚡ API de Alto Rendimiento**: Backend construido con FastAPI para máxima velocidad y escalabilidad

## 🛠️ Stack Tecnológico

<div align="center">

| Tecnología | Descripción | Logo |
|------------|-------------|------|
| **FastAPI** | Framework web moderno y rápido para Python con tipado automático | <img src="https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png" width="120" alt="FastAPI"/> |
| **LangChain** | Framework para desarrollo de aplicaciones potenciadas por modelos de lenguaje | <img src="https://python.langchain.com/img/brand/wordmark.png" width="120" alt="LangChain"/> |
| **ChromaDB** | Base de datos vectorial de código abierto para embeddings de IA | <img src="https://dbdb.io/media/logos/chroma_H600YUl.svg" width="120" alt="ChromaDB"/> |
| **OpenAI** | API de modelos de lenguaje avanzados para procesamiento de texto | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/2560px-OpenAI_Logo.svg.png" width="120" alt="OpenAI"/> |
| **Strapi** | CMS headless flexible para gestión de contenido y APIs | <img src="https://strapi.io/assets/strapi-logo-dark.svg" width="120" alt="Strapi"/> |
| **Next.js** | Superset tipado de JavaScript para desarrollo robusto | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nextjs-logo.svg/1024px-Nextjs-logo.svg.png" width="120" alt="Next.js"/>|

</div>

### Flujo de Datos RAG

1. **Ingesta y Procesamiento**: Los documentos se procesan automáticamente, dividiéndose en chunks semánticamente coherentes
2. **Vectorización**: Cada chunk se convierte en embeddings vectoriales y se almacena en ChromaDB
3. **Consulta Inteligente**: Las preguntas del usuario se vectorizan para encontrar contexto relevante
4. **Generación Aumentada**: OpenAI genera respuestas utilizando tanto su conocimiento base como el contexto recuperado
5. **Ejecución de Tools**: El sistema puede ejecutar herramientas específicas definidas en Strapi según el contexto de la conversación
