# API de E-commerce

API REST para gestionar productos y carritos de compra desarrollada con Node.js y Express.

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

## Ejecución

### Modo desarrollo
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor se ejecutará en `http://localhost:8080`

## Endpoints

### Productos (/api/products/)

- **GET /** - Listar todos los productos
- **GET /:pid** - Obtener producto por ID
- **POST /** - Crear nuevo producto
- **PUT /:pid** - Actualizar producto
- **DELETE /:pid** - Eliminar producto

#### Estructura de Producto
```json
{
  "id": "number/string (autogenerado)",
  "title": "string (requerido)",
  "description": "string (requerido)",
  "code": "string (requerido, único)",
  "price": "number (requerido)",
  "status": "boolean (default: true)",
  "stock": "number (requerido)",
  "category": "string (requerido)",
  "thumbnails": "array de strings (opcional)"
}
```

### Carritos (/api/carts/)

- **POST /** - Crear nuevo carrito
- **GET /:cid** - Listar productos del carrito
- **POST /:cid/product/:pid** - Agregar producto al carrito

#### Estructura de Carrito
```json
{
  "id": "number/string (autogenerado)",
  "products": [
    {
      "product": "id del producto",
      "quantity": "number"
    }
  ]
}
```

## Ejemplos de uso con cURL

### Crear un producto
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Producto de ejemplo",
    "description": "Descripción del producto",
    "code": "PROD001",
    "price": 100,
    "stock": 50,
    "category": "Electrónicos"
  }'
```

### Crear un carrito
```bash
curl -X POST http://localhost:8080/api/carts
```

### Agregar producto al carrito
```bash
curl -X POST http://localhost:8080/api/carts/1/product/1
```

## Persistencia

Los datos se almacenan en archivos JSON:
- `data/products.json` - Productos
- `data/carts.json` - Carritos

## Tecnologías utilizadas

- Node.js
- Express.js
- Sistema de archivos (JSON) para persistencia 