# E-commerce API con MongoDB

API de e-commerce desarrollada con Node.js, Express, MongoDB y Mongoose. Incluye funcionalidades completas de productos con paginación avanzada, múltiples filtros, ordenamiento y un sistema completo de gestión de carritos.

## Características

### Productos
- ✅ Paginación avanzada con límite personalizable (6, 12, 24 ítems por página)
- ✅ Filtros múltiples por categoría, disponibilidad y búsqueda por texto
- ✅ Ordenamiento por precio (ascendente/descendente) y nombre (A-Z/Z-A)
- ✅ Búsqueda en tiempo real en títulos y descripciones
- ✅ Validación de stock y disponibilidad
- ✅ Manejo de imágenes con múltiples thumbnails
- ✅ WebSockets para actualizaciones en tiempo real

### Carritos
- ✅ Sistema completo de gestión de carritos
- ✅ Agregar/eliminar productos individuales
- ✅ Actualización de cantidades con validación de stock
- ✅ Populate automático de productos para información detallada
- ✅ Vaciar carrito completo con confirmación
- ✅ Cálculo automático de subtotales y totales
- ✅ Interfaz intuitiva con feedback visual
- ✅ Manejo de errores y estados de carga

### Vistas
- ✅ Lista de productos con paginación
- ✅ Detalle de producto individual
- ✅ Vista de carrito específico
- ✅ Filtros y controles de interfaz

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd mi-api-ecommerce
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configuración del entorno**
   - Copia el archivo `.env.example` a `.env` y configura las variables necesarias:
   ```bash
   cp .env.example .env
   ```
   - Variables de entorno disponibles:
     - `PORT`: Puerto del servidor (por defecto: 8080)
     - `MONGODB_URI`: URL de conexión a MongoDB (por defecto: `mongodb://localhost:27017/ecommerce`)
     - `NODE_ENV`: Entorno de ejecución (development/production)

4. **Base de datos**
   - Asegúrate de tener MongoDB instalado y en ejecución
   - La aplicación creará automáticamente la base de datos al iniciar

5. **Ejecutar la aplicación**
```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Modo producción
npm start
```

6. **Acceder a la aplicación**
   - Interfaz web: http://localhost:8080
   - API REST: http://localhost:8080/api
   - Documentación de la API: http://localhost:8080/api-docs (requiere configuración de Swagger)

La aplicación estará disponible en `http://localhost:8080`

## 🏗️ Estructura del Proyecto

```
mi-api-ecommerce/
├── config/                  # Configuraciones
│   └── database.js          # Configuración de MongoDB
├── models/                  # Modelos de Mongoose
│   ├── Product.js           # Modelo de Producto
│   └── Cart.js              # Modelo de Carrito
├── controllers/             # Controladores
│   ├── products.controller.js
│   └── carts.controller.js
├── routes/                  # Rutas de la API
│   ├── products.router.js
│   └── carts.router.js
├── views/                   # Vistas Handlebars
│   ├── layouts/
│   ├── home.handlebars
│   ├── cart.handlebars
│   └── product-detail.handlebars
├── public/                  # Archivos estáticos
│   ├── css/
│   ├── js/
│   └── images/
├── .env.example            # Plantilla de variables de entorno
├── .gitignore
├── app.js                  # Aplicación principal
└── package.json
```

## 📚 Documentación de la API

### Productos

#### Obtener todos los productos
```
GET /api/products
```

**Parámetros de consulta:**
- `limit`: Número de productos por página (default: 10)
- `page`: Número de página (default: 1)
- `query`: Texto para búsqueda en título y descripción
- `category`: Filtrar por categoría
- `status`: Filtrar por disponibilidad (true/false)
- `sort`: Ordenar por precio ('asc' o 'desc') o nombre ('az' o 'za')

**Ejemplo de respuesta exitosa:**
```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 5,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "/api/products?page=1&limit=10",
  "nextLink": "/api/products?page=3&limit=10"
}
```

### Carritos

#### Obtener un carrito por ID
```
GET /api/carts/:cid
```

**Respuesta exitosa:**
```json
{
  "status": "success",
  "payload": {
    "_id": "cart_id",
    "products": [
      {
        "product": {
          "_id": "product_id",
          "title": "Producto Ejemplo",
          "price": 99.99,
          "thumbnails": ["url_imagen"]
        },
        "quantity": 2
      }
    ]
  }
}
```

#### Actualizar cantidad de un producto en el carrito
```
PUT /api/carts/:cid/products/:pid
```

**Cuerpo de la solicitud:**
```json
{
  "quantity": 3
}
```

#### Vaciar carrito
```
DELETE /api/carts/:cid
```

## 🛠️ Desarrollo

### Scripts disponibles
- `npm run dev`: Inicia el servidor en modo desarrollo con nodemon
- `npm start`: Inicia el servidor en modo producción
- `npm test`: Ejecuta las pruebas unitarias

### Variables de entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/ecommerce
NODE_ENV=development
```

## 🤝 Contribución
1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## ✨ Agradecimientos
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Handlebars](https://handlebarsjs.com/)
│   └── Cart.js              # Modelo de Carrito
├── managers/
│   ├── ProductManager.js    # Lógica de negocio de productos
│   └── CartManager.js       # Lógica de negocio de carritos
├── routes/
│   ├── products.js          # Rutas de API de productos
│   ├── carts.js             # Rutas de API de carritos
│   └── views.js             # Rutas de vistas
├── views/
│   ├── layouts/
│   │   └── main.handlebars  # Layout principal
│   ├── home.handlebars      # Lista de productos
│   ├── productDetail.handlebars # Detalle de producto
│   ├── cart.handlebars      # Vista de carrito
│   └── realTimeProducts.handlebars # Productos en tiempo real
├── public/
│   ├── css/
│   │   └── styles.css       # Estilos personalizados
│   └── js/
│       └── realTimeProducts.js # JavaScript para WebSockets
└── app.js                   # Aplicación principal
```

## API Endpoints

### Productos

#### GET /api/products
Obtiene productos con paginación, filtros y ordenamiento.

**Query Parameters:**
- `limit` (opcional): Número de productos por página (default: 10)
- `page` (opcional): Número de página (default: 1)
- `sort` (opcional): Ordenamiento por precio (`asc` o `desc`)
- `query` (opcional): Filtro por categoría o disponibilidad

**Ejemplos:**
```bash
# Obtener primera página con 5 productos
GET /api/products?limit=5&page=1

# Filtrar productos disponibles ordenados por precio ascendente
GET /api/products?query=available&sort=asc

# Filtrar por categoría "electronics"
GET /api/products?query=electronics
```

**Respuesta:**
```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 5,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "http://localhost:8080/api/products?page=1&limit=10",
  "nextLink": "http://localhost:8080/api/products?page=3&limit=10"
}
```

#### GET /api/products/:pid
Obtiene un producto específico por ID.

#### POST /api/products
Crea un nuevo producto.

#### PUT /api/products/:pid
Actualiza un producto existente.

#### DELETE /api/products/:pid
Elimina un producto.

### Carritos

#### POST /api/carts
Crea un nuevo carrito.

#### GET /api/carts/:cid
Obtiene productos de un carrito específico (con populate).

#### POST /api/carts/:cid/product/:pid
Agrega un producto al carrito.

#### DELETE /api/carts/:cid/products/:pid
Elimina un producto específico del carrito.

#### PUT /api/carts/:cid
Actualiza todos los productos del carrito.

#### PUT /api/carts/:cid/products/:pid
Actualiza la cantidad de un producto específico.

#### DELETE /api/carts/:cid
Elimina todos los productos del carrito.

## Vistas

### Páginas Principales

- **/** - Lista de productos con paginación y filtros
- **/products/:pid** - Detalle de producto individual
- **/carts/:cid** - Vista de carrito específico
- **/realtimeproducts** - Productos en tiempo real con WebSockets

## Filtros Disponibles

### Por Disponibilidad
- `available` o `disponible` - Productos disponibles (status: true, stock > 0)
- `unavailable` o `no-disponible` - Productos no disponibles

### Por Categoría
- `electronics` - Electrónicos
- `clothing` - Ropa
- `books` - Libros
- O cualquier categoría personalizada

## Ordenamiento

- `asc` - Precio ascendente (menor a mayor)
- `desc` - Precio descendente (mayor a menor)
- Sin parámetro - Sin ordenamiento específico

## Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Handlebars** - Motor de plantillas
- **Socket.IO** - WebSockets para tiempo real
- **Bootstrap** - Framework CSS

## Variables de Entorno

```bash
MONGODB_URI=mongodb://localhost:27017/ecommerce
BASE_URL=http://localhost:8080
PORT=8080
```

## Desarrollo

### Scripts Disponibles

```bash
npm start      # Ejecutar en producción
npm run dev    # Ejecutar en desarrollo con nodemon
```

### Estructura de Datos

#### Producto
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  code: String (único),
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: [String],
  createdAt: Date,
  updatedAt: Date
}
```

#### Carrito
```javascript
{
  _id: ObjectId,
  products: [{
    product: ObjectId (ref: Product),
    quantity: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC.