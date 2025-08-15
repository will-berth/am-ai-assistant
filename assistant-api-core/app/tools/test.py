from langchain.tools import tool
from typing import Dict, Any

@tool
def create_resource(data: Dict[str, Any]) -> str:
    """
    Crea un recurso en la API externa.
    
    El parámetro `data` debe ser un diccionario con los campos necesarios.
    """
    try:
        print("El agente ejecuto correctamente la tool create_resource")
        return f"Hola"
    except Exception as e:
        return f"Error al llamar la API: {str(e)}"


@tool(description="Imprime un mensaje de prueba")
def print_text(random: str):
    print('RANDOM', random)
    print("El agente ejecuto correctamente la tool print_text")