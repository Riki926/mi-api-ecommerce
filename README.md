# E-commerce API - Node.js + Express + MongoDB

Backend profesional para e-commerce con autenticación JWT, gestión de carritos y sistema de compras.

## Tecnologías

- Node.js 18+
- Express 4
- MongoDB Atlas con Mongoose 7
- Passport JWT para autenticación
- bcrypt para hash de contraseñas
- nodemailer para emails
- Arquitectura: Repository Pattern + DAO + DTO

## Estructura del Proyecto

```
src/
├── config/
│   ├── database.js       # Configuración MongoDB
│   └── passport.js       # Estrategia JWT
├── models/               # Modelos Mongoose
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Ticket.js
├── dao/                  # Data Access Objects
├── repositories/         # Capa Repository
├── services/             # Lógica de negocio
├── routes/               # Rutas Express
├── middleware/           # Middleware de auth
├── dto/                  # Data Transfer Objects
├── utils/                # Utilidades (hash, jwt)
├── app.js               # Configuración Express
└── server.js            # Punto de entrada
```

## Requisitos Previos

- Node.js 18 o superior
- MongoDB Atlas (cuenta gratuita)
- Cuenta en Mailtrap.io (opcional, para testing de emails)

## Instalación

1. **Clonar el repositorio**

```bash
git clone <repo-url>
cd mi-api-ecommerce
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Copiar `.env.example` a `.env`:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=ecommerce
PORT=8080

JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRE=7d

SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=tu_usuario_mailtrap
SMTP_PASS=tu_password_mailtrap

FRONTEND_URL=http://localhost:3000
```

4. **Ejecutar el servidor**

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## Endpoints

### Health Check

```bash
curl http://localhost:8080/api/health
```

Respuesta: `{"ok":true}`

---

### 1. AUTENTICACIÓN (/api/sessions)

#### Registrar Usuario

```bash
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 30,
    "password": "password123"
  }'
```

Respuesta: `{"uid":"64abc123..."}`

#### Login

```bash
curl -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

Respuesta: `{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}`

**Guardar el token para las siguientes peticiones**

#### Obtener Usuario Actual

```bash
curl http://localhost:8080/api/sessions/current \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

Respuesta:
```json
{
  "user": {
    "id": "64abc123...",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 30,
    "role": "user",
    "cart": "64abc456..."
  }
}
```

#### Solicitar Reset de Contraseña

```bash
curl -X POST http://localhost:8080/api/sessions/forgot \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com"
  }'
```

Respuesta: `{"sent":true}`

Se enviará un email con un link que expira en 1 hora.

#### Resetear Contraseña

```bash
curl -X POST http://localhost:8080/api/sessions/reset \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_DEL_EMAIL",
    "newPassword": "nuevaPassword456"
  }'
```

Respuesta: `{"reset":true}`

**Nota**: No se permite usar la misma contraseña anterior.

---

### 2. USUARIOS - ADMIN (/api/users)

**Requiere**: Token de admin en Authorization header

#### Crear un Admin Manualmente

Para crear el primer admin, ejecuta en MongoDB:

```javascript
// En MongoDB Compass o mongo shell
db.users.updateOne(
  { email: "juan@example.com" },
  { $set: { role: "admin" } }
)
```

#### Listar Usuarios

```bash
curl http://localhost:8080/api/users \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

#### Obtener Usuario por ID

```bash
curl http://localhost:8080/api/users/64abc123... \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

#### Eliminar Usuario

```bash
curl -X DELETE http://localhost:8080/api/users/64abc123... \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

---

### 3. PRODUCTOS (/api/products)

#### Listar Productos (Público)

```bash
curl http://localhost:8080/api/products
```

#### Crear Producto (Admin)

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Laptop Dell XPS 15",
    "description": "Laptop de alta gama",
    "price": 1500,
    "stock": 10
  }'
```

#### Actualizar Producto (Admin)

```bash
curl -X PUT http://localhost:8080/api/products/64xyz789... \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1400,
    "stock": 8
  }'
```

#### Eliminar Producto (Admin)

```bash
curl -X DELETE http://localhost:8080/api/products/64xyz789... \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

---

### 4. CARRITO (/api/carts)

**Requiere**: Token de usuario (role: user)

#### Ver Mi Carrito

```bash
curl http://localhost:8080/api/carts/mine \
  -H "Authorization: Bearer TOKEN_USER"
```

#### Agregar Producto al Carrito

```bash
curl -X POST http://localhost:8080/api/carts/mine/items \
  -H "Authorization: Bearer TOKEN_USER" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "64xyz789...",
    "quantity": 2
  }'
```

Si el producto ya existe, suma las cantidades. Valida stock disponible.

#### Eliminar Producto del Carrito

```bash
curl -X DELETE http://localhost:8080/api/carts/mine/items/64xyz789... \
  -H "Authorization: Bearer TOKEN_USER"
```

#### Vaciar Carrito

```bash
curl -X DELETE http://localhost:8080/api/carts/mine \
  -H "Authorization: Bearer TOKEN_USER"
```

---

### 5. CHECKOUT (/api/checkout)

**Requiere**: Token de usuario (role: user)

#### Realizar Compra

```bash
curl -X POST http://localhost:8080/api/checkout/purchase \
  -H "Authorization: Bearer TOKEN_USER"
```

**Respuesta exitosa**:
```json
{
  "ticket": {
    "code": "TICKET-1699123456789-ABC123",
    "amount": 3000,
    "purchaser": "juan@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "notProcessed": []
}
```

**Si hay productos sin stock suficiente**:
```json
{
  "ticket": {
    "code": "TICKET-1699123456789-ABC123",
    "amount": 1500,
    "purchaser": "juan@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "notProcessed": [
    {
      "productId": "64xyz999...",
      "title": "Mouse Gamer",
      "requestedQuantity": 5,
      "availableStock": 2
    }
  ]
}
```

**Lógica de compra**:
- Para cada producto en el carrito:
  - Si hay stock suficiente: descuenta del stock y procesa
  - Si no hay stock: lo agrega a `notProcessed`
- Genera un Ticket con los productos procesados
- Vacía del carrito solo lo procesado
- Deja en el carrito los productos que no se pudieron procesar

---

## Flujo Completo de Prueba

### 1. Registrar y hacer login como usuario

```bash
# Registrar
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"María","last_name":"García","email":"maria@test.com","age":25,"password":"pass123"}'

# Login
curl -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@test.com","password":"pass123"}'

# Guardar el token
export USER_TOKEN="token_recibido_aqui"
```

### 2. Crear admin y productos

```bash
# Cambiar rol a admin en MongoDB
# Luego login como admin
export ADMIN_TOKEN="token_admin_aqui"

# Crear productos
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Teclado Mecánico","description":"RGB","price":100,"stock":5}'

curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Mouse Inalámbrico","description":"Ergonómico","price":50,"stock":10}'
```

### 3. Agregar al carrito y comprar

```bash
# Listar productos y copiar IDs
curl http://localhost:8080/api/products

# Agregar al carrito
curl -X POST http://localhost:8080/api/carts/mine/items \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"ID_PRODUCTO_1","quantity":2}'

curl -X POST http://localhost:8080/api/carts/mine/items \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"ID_PRODUCTO_2","quantity":1}'

# Ver carrito
curl http://localhost:8080/api/carts/mine \
  -H "Authorization: Bearer $USER_TOKEN"

# Realizar compra
curl -X POST http://localhost:8080/api/checkout/purchase \
  -H "Authorization: Bearer $USER_TOKEN"
```

### 4. Probar reset de contraseña

```bash
# Solicitar reset
curl -X POST http://localhost:8080/api/sessions/forgot \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@test.com"}'

# Revisar email en Mailtrap
# Copiar el token del link

# Resetear (debe fallar con la misma contraseña)
curl -X POST http://localhost:8080/api/sessions/reset \
  -H "Content-Type: application/json" \
  -d '{"token":"TOKEN_DEL_EMAIL","newPassword":"pass123"}'

# Resetear con nueva contraseña (debe funcionar)
curl -X POST http://localhost:8080/api/sessions/reset \
  -H "Content-Type: application/json" \
  -d '{"token":"TOKEN_DEL_EMAIL","newPassword":"nuevaPass456"}'
```

---

## Características Implementadas

### Entrega N°1
- ✅ Modelo User con bcrypt
- ✅ Passport JWT configurado
- ✅ Endpoint /api/sessions/current
- ✅ CRUD de usuarios (solo admin)
- ✅ Autorización por roles

### Entrega Final
- ✅ Patrón Repository/DAO/DTO
- ✅ Recuperación de contraseña con token expirable (1h)
- ✅ Validación: no permite repetir contraseña anterior
- ✅ Sistema de compra con Ticket
- ✅ Manejo de stock
- ✅ Lista de productos no procesados
- ✅ Carrito 1:1 con usuario
- ✅ Envío de emails con nodemailer

---

## Roles y Permisos

| Ruta | Público | User | Admin |
|------|---------|------|-------|
| GET /api/health | ✅ | ✅ | ✅ |
| POST /api/sessions/register | ✅ | ✅ | ✅ |
| POST /api/sessions/login | ✅ | ✅ | ✅ |
| GET /api/sessions/current | ❌ | ✅ | ✅ |
| POST /api/sessions/forgot | ✅ | ✅ | ✅ |
| POST /api/sessions/reset | ✅ | ✅ | ✅ |
| GET /api/users | ❌ | ❌ | ✅ |
| GET /api/users/:id | ❌ | ❌ | ✅ |
| DELETE /api/users/:id | ❌ | ❌ | ✅ |
| GET /api/products | ✅ | ✅ | ✅ |
| POST /api/products | ❌ | ❌ | ✅ |
| PUT /api/products/:id | ❌ | ❌ | ✅ |
| DELETE /api/products/:id | ❌ | ❌ | ✅ |
| GET /api/carts/mine | ❌ | ✅ | ❌ |
| POST /api/carts/mine/items | ❌ | ✅ | ❌ |
| DELETE /api/carts/mine/items/:id | ❌ | ✅ | ❌ |
| DELETE /api/carts/mine | ❌ | ✅ | ❌ |
| POST /api/checkout/purchase | ❌ | ✅ | ❌ |

---

## Troubleshooting

### Error de conexión a MongoDB

Verifica que:
- Tu IP esté en la whitelist de MongoDB Atlas
- Las credenciales en `.env` sean correctas
- El formato de MONGODB_URI sea correcto

### Emails no llegan

- Verifica las credenciales de Mailtrap en `.env`
- Los emails de prueba aparecen en tu inbox de Mailtrap, no en email real

### Error "Insufficient stock"

El producto no tiene suficiente stock. Verifica:
```bash
curl http://localhost:8080/api/products
```

### Token inválido

El token puede haber expirado (7 días por defecto). Haz login nuevamente.

---

## Licencia

ISC
