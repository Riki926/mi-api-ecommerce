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

## 🚀 Pasos para probar la aplicación

### 1. Clonar e instalar
```bash
# Clonar el repositorio
git clone https://github.com/Riki926/mi-api-ecommerce.git

# Entrar al directorio
cd mi-api-ecommerce

# Instalar dependencias
npm install
```

### 2. Iniciar el servidor
```bash
# Iniciar en modo desarrollo
npm run dev
```
El servidor estará disponible en `http://localhost:8080`

### 3. Probar la API (Dos opciones)

#### Opción A: Interfaz Web con WebSockets
1. Abre en tu navegador: `http://localhost:8080/realtimeproducts`
2. Verás un formulario para crear productos y una lista en tiempo real
3. Los cambios se actualizan automáticamente para todos los usuarios conectados

#### Opción B: Interfaz de Prueba REST
1. Abre el archivo `test.html` en tu navegador
2. Haz clic en "🔗 Probar Conexión" para verificar que el servidor está funcionando
3. Prueba las diferentes operaciones:
   - GET/POST de productos
   - Gestión de carritos
   - Agregar productos al carrito

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