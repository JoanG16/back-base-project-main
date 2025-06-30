# Project
Proyecto de App Web para el Mercado Nuevo Tarqui.

## 🚀 Características

- Arquitectura limpia
- Inyección de dependencias con Awilix
- Validación de datos con Joi
- Manejo de errores centralizado
- Middleware de autenticación
- Documentación con Swagger
- Base de datos Postgrest

## 🛠️ Tecnologías

- Node.js
- Express
- Joi
- Awilix
- JWT
- Swagger

## 🔧 Instalación y Configuración

```
# Instalar dependencias
npm i

# Iniciar en desarrollo
npm run dev

```

## 🛣️ Ruta de prueba

Tener en cuenta en que port está corriendo la aplicación, en este caso es el 3000

```
http://localhost:3000/v1/api/example/get-all

```

Para la funcionalidad del login debe registrar un usuario

```
{
    "username": "ejemplo",
    "password": "12345678"
}

```

```
http://localhost:3000/v1/api/auth/register

```

