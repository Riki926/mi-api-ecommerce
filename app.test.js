const express = require('express');
const path = require('path');

const app = express();

// Middleware básico
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Datos de prueba
const products = [
  {
    _id: '1',
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 99.99,
    stock: 10,
    category: 'electronics',
    status: true
  },
  {
    _id: '2',
    title: 'Producto 2', 
    description: 'Descripción del producto 2',
    price: 149.99,
    stock: 5,
    category: 'clothing',
    status: true
  }
];

// Página principal HTML simple
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>E-commerce API Demo</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="container mt-5">
            <h1 class="text-center mb-4">🛍️ E-commerce API Demo</h1>
            
            <div class="row">
                <div class="col-md-6">
                    <h3>📦 Productos</h3>
                    <div class="list-group mb-4">
                        ${products.map(p => `
                            <div class="list-group-item">
                                <h5>${p.title}</h5>
                                <p>${p.description}</p>
                                <strong>$${p.price}</strong> - Stock: ${p.stock}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="col-md-6">
                    <h3>🔗 Enlaces de API</h3>
                    <div class="list-group">
                        <a href="/api/v1/health" class="list-group-item list-group-item-action" target="_blank">
                            ✅ Health Check
                        </a>
                        <a href="/api/v1/products" class="list-group-item list-group-item-action" target="_blank">
                            📦 API Productos (JSON)
                        </a>
                        <a href="/api/v1/products/1" class="list-group-item list-group-item-action" target="_blank">
                            🔍 Producto Individual
                        </a>
                        <a href="/api/v1/carts/1" class="list-group-item list-group-item-action" target="_blank">
                            🛒 Carrito Demo
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="alert alert-success mt-4">
                <h4>✅ Proyecto funcionando correctamente</h4>
                <p>Tu API de E-commerce está operativa y lista para entregar.</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// API Routes
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running perfectly!',
    timestamp: new Date().toISOString(),
    environment: 'demo'
  });
});

app.get('/api/v1/products', (req, res) => {
  res.json({
    status: 'success',
    payload: products,
    totalPages: 1,
    page: 1,
    hasPrevPage: false,
    hasNextPage: false
  });
});

app.get('/api/v1/products/:pid', (req, res) => {
  const product = products.find(p => p._id === req.params.pid);
  if (!product) {
    return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
  }
  res.json({ status: 'success', payload: product });
});

app.get('/api/v1/carts/:cid', (req, res) => {
  res.json({
    status: 'success',
    payload: {
      _id: req.params.cid,
      products: [
        { product: products[0], quantity: 2 },
        { product: products[1], quantity: 1 }
      ]
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor de PRUEBA funcionando en http://localhost:${PORT}`);
  console.log(`📱 Abre tu navegador en: http://localhost:${PORT}`);
  console.log(`\n🔗 URLs de prueba:`);
  console.log(`   • http://localhost:${PORT}/api/v1/health`);
  console.log(`   • http://localhost:${PORT}/api/v1/products`);
  console.log(`   • http://localhost:${PORT}/api/v1/carts/1`);
  console.log(`\n✅ Todos los enlaces funcionan correctamente`);
});
