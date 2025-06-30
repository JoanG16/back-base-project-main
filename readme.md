# Base Project Node.js

Proyecto base para aplicaciones Node.js con Express, siguiendo arquitectura limpia y mejores prácticas.

🎮 ZGames 🎮

## 🚀 Características

- Arquitectura limpia
- Inyección de dependencias con Awilix
- Validación de datos con Joi
- Manejo de errores centralizado
- Middleware de autenticación
- Documentación con Swagger
- Base de datos MongoDB

## 🛠️ Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
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

> Nota: esto es una estructura base, comprobar las funciones que son utiles para el proyecto a realizar, las que no se usen remover para mantener un código limpio.
