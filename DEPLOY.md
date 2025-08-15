# AM AI Assistant

Un sistema completo de asistente de IA con capacidades de RAG (Retrieval-Augmented Generation).

## 📋 Requisitos Previos

- Node.js 22.x
- Docker y Docker Compose
- Git
- Clave API de OpenAI

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/will-berth/am-ai-assistant.git
cd am-ai-assistant
```

### 2. Configurar Variables de Entorno

Copia los archivos `.env.example` a `.env` en los siguientes directorios:

```bash
# Directorio raíz
cp .env.example .env

# Servicio API Core
cp assistant-api-core/.env.example assistant-api-core/.env

# Frontend
cp assistant-front/.env.example assistant-front/.env

# CMS Strapi
cp strapi-cms/.env.example strapi-cms/.env
```

### 3. Configurar API de OpenAI

En `assistant-api-core/.env`, reemplaza:

```env
OPENAI_API_KEY=tu_clave_api_de_openai_aquí
```

### 4. Generar Secretos para Strapi

Para generar las claves puedes crear un proyecto temporal de Strapi:

```bash
# Crear proyecto temporal fuera del directorio actual
cd ..
npx create-strapi-app@latest temp-strapi --quickstart
```

Una vez creado, copia los secretos generados y reemplaza en `strapi-cms/.env`:

- `APP_KEYS`
- `API_TOKEN_SALT`
- `ADMIN_JWT_SECRET`
- `TRANSFER_TOKEN_SALT`
- `ENCRYPTION_KEY`

> **Nota**: Mantén las variables de base de datos y `NODE_ENV=development` tal como están para permitir la creación de nuevas colecciones.

```bash
# Eliminar proyecto temporal
rm -rf temp-strapi
cd am-ai-assistant
```

### 5. Iniciar los Servicios

```bash
docker compose up --build -d
```

### 6. Reiniciar el Backend (si es necesario)

Si el servicio backend falla al iniciar:

```bash
docker compose up am_rag -d
```

## ⚙️ Configuración de Strapi

### 1. Configurar Administrador

1. Ve a `http://localhost:1337/admin`
2. Completa el formulario de registro de administrador

### 2. Generar Token de API

1. En el panel de Strapi, ve a **Settings**
2. Busca **API Tokens**
3. Edita el registro de "Full Access"
4. Haz clic en **View Token** (esquina superior derecha)
5. Copia el token generado

### 3. Actualizar Token JWT

En `assistant-api-core/.env`, reemplaza:

```env
JWT_TOKEN=token_copiado_de_strapi
```

### 4. Reiniciar el Servicio API

```bash
docker compose up -d --force-recreate am_rag
```
o
```bash
docker compose up -d --build am_rag
```

### 5. Crear Colección de Notas

1. En Strapi, ve a **Content-Type Builder**
2. En **Collection Types**, haz clic en **Create new collection type**
3. Configura:
   - **Display Name**: `Note`
4. Agrega los siguientes campos:
   - **title**: Text (Short text)
   - **description**: Rich text (Blocks)  
   - **added_at**: Date (datetime)
5. Guarda la colección

# 🎉 Sistema activo
AM AI Assistant esta listo para usarse ingresando a `http://localhost:3000`

## 🌐 Acceso a los Servicios

Una vez configurado correctamente:

- **Frontend**: `http://localhost:3000`
- **API Backend**: `http://localhost:8000`
- **Strapi CMS**: `http://localhost:1337/admin`

## ⚠️ Notas Importantes

- **Persistencia de Datos**: Los datasets del asistente se almacenan en memoria. Si se reinicia `assistant-api-core`, será necesario cargar un nuevo dataset. Los datos persisten únicamente en PostgreSQL.

- **Configuración de Desarrollo**: El entorno está configurado como `development` para permitir modificaciones dinámicas en las colecciones de Strapi.

## 🛠️ Comandos Útiles

```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f am_rag

# Reiniciar todos los servicios
docker compose restart

# Detener todos los servicios
docker compose down

# Reconstruir y reiniciar
docker compose up --build -d
```

## 📁 Estructura del Proyecto

```
am-ai-assistant/
├── assistant-api-core/     # API backend con capacidades RAG
├── assistant-front/        # Frontend de la aplicación
├── strapi-cms/            # CMS para gestión de contenido
├── docker-compose.yml     # Configuración de servicios Docker
└── README.md             # Este archivo
```

## 🐛 Solución de Problemas

1. **El backend no inicia**: Ejecuta `docker compose up am_rag -d`
2. **Error de autenticación**: Verifica que el `JWT_TOKEN` esté correctamente configurado
3. **Problemas con OpenAI**: Verifica que tu `OPENAI_API_KEY` sea válida y tenga créditos disponibles
