# API E-commerce

API REST para un sistema de e-commerce desarrollada con Node.js y Express.

## 🚀 Características

- Gestión de productos (CRUD)
- Gestión de carritos de compra
- Interfaz de prueba en tiempo real
- Documentación interactiva

## 📋 Requisitos previos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd mi-api-ecommerce
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:8080`

## 📱 Probar la API

1. Abre el archivo `test.html` en tu navegador
2. Usa los botones disponibles para probar las diferentes funcionalidades:
   - Gestión de productos
   - Gestión de carritos
   - Operaciones en tiempo real

## 🛠️ Tecnologías utilizadas

- Node.js
- Express
- Socket.IO
- Handlebars
- CORS

## 📄 Endpoints disponibles

### Productos
- `GET /api/products` - Obtener todos los productos
- `POST /api/products` - Crear un nuevo producto
- `GET /api/products/:id` - Obtener un producto por ID

### Carritos
- `POST /api/carts` - Crear un nuevo carrito
- `GET /api/carts/:id` - Obtener un carrito por ID
- `POST /api/carts/:cid/product/:pid` - Agregar producto al carrito

## 👩‍💻 Desarrollo

Para ejecutar en modo desarrollo con recarga automática:
```bash
npm run dev
```