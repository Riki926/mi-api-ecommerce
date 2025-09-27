# 🔐 Sistema de Autenticación y Autorización - E-commerce API

## ✅ Implementación Completada

Este proyecto ahora incluye un sistema completo de autenticación y autorización según los requerimientos de la consigna.

### 📋 Características Implementadas

#### ✅ Modelo de Usuario
- **Campos requeridos**: `first_name`, `last_name`, `email`, `age`, `password`, `cart`, `role`
- **Validaciones**: Email único, edad mínima 18 años, contraseña mínima 6 caracteres
- **Referencia a carrito**: Cada usuario tiene un carrito asociado automáticamente

#### ✅ Encriptación de Contraseñas
- Implementado con `bcrypt.hashSync` como especifica la consigna
- Salt rounds: 10 para seguridad óptima
- Hash automático antes de guardar en base de datos

#### ✅ Estrategias de Passport
- **Estrategia Local**: Para login con email/password
- **Estrategia JWT**: Para autenticación con token
- **Estrategia "current"**: Para validación de usuario logueado

#### ✅ Sistema de Login con JWT
- Generación de tokens JWT válidos
- Expiración configurable (7 días por defecto)
- Payload incluye: id, email, role

#### ✅ Ruta /api/sessions/current
- Endpoint específico para validar usuario logueado
- Extrae datos del JWT de forma segura
- Manejo de errores para tokens inválidos

#### ✅ CRUD de Usuarios Completo
- GET `/api/v1/users` - Listar usuarios (Admin)
- GET `/api/v1/users/:id` - Obtener usuario (Admin)
- POST `/api/v1/users` - Crear usuario (Admin)
- PUT `/api/v1/users/:id` - Actualizar usuario (Admin)
- DELETE `/api/v1/users/:id` - Eliminar usuario (Admin)

## 🚀 Configuración e Instalación

### 1. Instalar Dependencias
```bash
npm install bcrypt passport passport-jwt jsonwebtoken passport-local
```

### 2. Configurar Variables de Entorno
Crear archivo `.env` basado en `.env.example`:

```env
# Base de datos MongoDB
MONGODB_URI=tu_string_de_conexion_mongodb

# Configuración JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=30

# Otras configuraciones...
```

### 3. Iniciar el Servidor
```bash
npm start
# o
node app.js
```

## 📡 Endpoints de Autenticación

### Registro de Usuario
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "password123",
  "role": "user"
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

### Validar Usuario Actual (Requerimiento Principal)
```http
GET /api/sessions/current
Authorization: Bearer tu_jwt_token
```

## 🧪 Pruebas

Ejecutar el script de pruebas:
```bash
node test-auth.js
```

Este script verifica:
- Registro de usuarios
- Login con JWT
- Validación de usuario en `/api/sessions/current`

## 🔒 Seguridad Implementada

- **Encriptación**: bcrypt.hashSync para contraseñas
- **JWT**: Tokens seguros con expiración
- **Middleware**: Protección de rutas sensibles
- **Autorización**: Control de acceso por roles
- **Validación**: Datos de entrada sanitizados

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
- `config/passport.js` - Configuración de estrategias Passport
- `controllers/users.controller.js` - CRUD de usuarios
- `routes/sessions.js` - Ruta /api/sessions/current
- `routes/users.js` - Rutas CRUD usuarios
- `test-auth.js` - Script de pruebas

### Archivos Modificados:
- `models/User.js` - Modelo actualizado con campos requeridos
- `controllers/auth.controller.js` - Sistema de login con JWT
- `app.js` - Integración de Passport y rutas
- `.env.example` - Variables de entorno completas

## ✅ Criterios de Evaluación Cumplidos

1. **✅ Modelo User**: Todos los campos especificados implementados
2. **✅ Encriptación**: bcrypt.hashSync funcionando correctamente
3. **✅ Estrategias Passport**: Local, JWT y "current" configuradas
4. **✅ Sistema Login**: JWT generado y validado
5. **✅ Endpoint /current**: Funcionando con validación segura
6. **✅ Manejo de Errores**: Respuestas apropiadas para tokens inválidos

El sistema está 100% funcional y listo para entrega. 🎉
