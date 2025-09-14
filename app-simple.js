const express = require('express');
const app = express();

app.use(express.json());

// Datos de prueba
const products = [
  { _id: '1', title: 'Smartphone', description: 'Teléfono inteligente', price: 599.99, stock: 15 },
  { _id: '2', title: 'Laptop', description: 'Computadora portátil', price: 899.99, stock: 8 },
  { _id: '3', title: 'Auriculares', description: 'Auriculares inalámbricos', price: 299.99, stock: 25 }
];

const carts = [{ _id: '1', products: [{ product: '1', quantity: 2 }] }];

// Página principal
app.get('/', (req, res) => {
  res.send(`
    <html>
    <head>
        <title>E-commerce API</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="/">🛍️ E-commerce API</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item"><a class="nav-link" href="/">Inicio</a></li>
                        <li class="nav-item"><a class="nav-link" href="/products">Productos</a></li>
                        <li class="nav-item"><a class="nav-link" href="/cart">Carrito</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        
        <div class="container mt-4">
            <div class="jumbotron bg-light p-4 rounded">
                <h1 class="display-4">🚀 E-commerce API Demo</h1>
                <p class="lead">Proyecto Node.js con Express completamente funcional</p>
            </div>
            
            <div class="row mt-4">
                <div class="col-md-6">
                    <h3>📦 Productos</h3>
                    ${products.map(p => `
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">${p.title}</h5>
                                <p class="card-text">${p.description}</p>
                                <p class="text-primary"><strong>$${p.price}</strong></p>
                                <button class="btn btn-success btn-sm" onclick="addToCart('${p._id}')">🛒 Agregar</button>
                                <a href="/products/${p._id}" class="btn btn-outline-primary btn-sm">Ver</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="col-md-6">
                    <h3>🔗 APIs Disponibles</h3>
                    <div class="list-group">
                        <a href="/api/products" class="list-group-item list-group-item-action" target="_blank">
                            📦 GET /api/products - Lista de productos
                        </a>
                        <a href="/api/products/1" class="list-group-item list-group-item-action" target="_blank">
                            🔍 GET /api/products/1 - Producto específico
                        </a>
                        <a href="/api/carts/1" class="list-group-item list-group-item-action" target="_blank">
                            🛒 GET /api/carts/1 - Carrito
                        </a>
                        <a href="/api/health" class="list-group-item list-group-item-action" target="_blank">
                            ✅ GET /api/health - Estado del servidor
                        </a>
                    </div>
                    
                    <div class="alert alert-success mt-3">
                        <h5>✅ Estado: FUNCIONANDO</h5>
                        <p class="mb-0">Todas las rutas operativas</p>
                    </div>
                </div>
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        <script>
            function addToCart(productId) {
                fetch('/api/carts/1/products/' + productId, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert('✅ Producto agregado al carrito');
                    } else {
                        alert('❌ Error: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('❌ Error de conexión');
                });
            }
        </script>
    </body>
    </html>
  `);
});

// Página de productos
app.get('/products', (req, res) => {
  res.send(`
    <html>
    <head>
        <title>Productos</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <nav class="navbar navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="/">🛍️ E-commerce</a>
                <a class="btn btn-outline-light" href="/">← Volver</a>
            </div>
        </nav>
        <div class="container mt-4">
            <h1>📦 Catálogo de Productos</h1>
            <div class="row">
                ${products.map(p => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5>${p.title}</h5>
                                <p>${p.description}</p>
                                <h4 class="text-primary">$${p.price}</h4>
                                <p class="text-muted">Stock: ${p.stock}</p>
                                <button class="btn btn-primary" onclick="addToCart('${p._id}')">🛒 Agregar</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        <script>
            function addToCart(id) {
                fetch('/api/carts/1/products/' + id, { method: 'POST' })
                .then(r => r.json())
                .then(d => alert(d.status === 'success' ? '✅ Agregado' : '❌ Error'));
            }
        </script>
    </body>
    </html>
  `);
});

// Página individual de producto
app.get('/products/:pid', (req, res) => {
  const product = products.find(p => p._id === req.params.pid);
  if (!product) {
    return res.status(404).send('<h1>Producto no encontrado</h1><a href="/">Volver</a>');
  }
  
  res.send(`
    <html>
    <head>
        <title>${product.title}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <nav class="navbar navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="/">🛍️ E-commerce</a>
                <a class="btn btn-outline-light" href="/products">← Productos</a>
            </div>
        </nav>
        <div class="container mt-4">
            <div class="row">
                <div class="col-md-6">
                    <div class="bg-light p-5 text-center rounded">
                        <h2>📦</h2>
                        <p>Imagen del producto</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <h1>${product.title}</h1>
                    <p class="lead">${product.description}</p>
                    <h3 class="text-primary">$${product.price}</h3>
                    <p><strong>Stock disponible:</strong> ${product.stock} unidades</p>
                    <button class="btn btn-primary btn-lg" onclick="addToCart('${product._id}')">🛒 Agregar al Carrito</button>
                    <a href="/cart" class="btn btn-outline-secondary btn-lg ms-2">Ver Carrito</a>
                </div>
            </div>
        </div>
        <script>
            function addToCart(id) {
                fetch('/api/carts/1/products/' + id, { method: 'POST' })
                .then(r => r.json())
                .then(d => alert(d.status === 'success' ? '✅ Producto agregado' : '❌ Error'));
            }
        </script>
    </body>
    </html>
  `);
});

// Página de carrito
app.get('/cart', (req, res) => {
  const cart = carts[0];
  const cartProducts = cart.products.map(item => {
    const product = products.find(p => p._id === item.product);
    return { ...item, productData: product };
  });
  
  let total = 0;
  cartProducts.forEach(item => {
    total += item.productData.price * item.quantity;
  });
  
  res.send(`
    <html>
    <head>
        <title>Carrito</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <nav class="navbar navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="/">🛍️ E-commerce</a>
                <a class="btn btn-outline-light" href="/">← Inicio</a>
            </div>
        </nav>
        <div class="container mt-4">
            <h1>🛒 Mi Carrito</h1>
            ${cartProducts.length > 0 ? `
                <div class="row">
                    <div class="col-md-8">
                        ${cartProducts.map(item => `
                            <div class="card mb-3">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-md-6">
                                            <h5>${item.productData.title}</h5>
                                            <p class="text-muted">${item.productData.description}</p>
                                        </div>
                                        <div class="col-md-2">
                                            <strong>$${item.productData.price}</strong>
                                        </div>
                                        <div class="col-md-2">
                                            <span class="badge bg-primary">Qty: ${item.quantity}</span>
                                        </div>
                                        <div class="col-md-2">
                                            <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.product}')">🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header bg-success text-white">
                                <h5>💰 Resumen</h5>
                            </div>
                            <div class="card-body">
                                <p><strong>Total: $${total.toFixed(2)}</strong></p>
                                <button class="btn btn-success w-100 mb-2">💳 Pagar</button>
                                <button class="btn btn-outline-danger w-100" onclick="clearCart()">🗑️ Vaciar</button>
                            </div>
                        </div>
                    </div>
                </div>
            ` : `
                <div class="alert alert-info">
                    <h4>Carrito vacío</h4>
                    <p>No tienes productos en tu carrito.</p>
                    <a href="/products" class="btn btn-primary">Ver Productos</a>
                </div>
            `}
        </div>
        <script>
            function removeFromCart(productId) {
                fetch('/api/carts/1/products/' + productId, { method: 'DELETE' })
                .then(r => r.json())
                .then(d => {
                    if (d.status === 'success') {
                        alert('✅ Producto eliminado');
                        location.reload();
                    }
                });
            }
            
            function clearCart() {
                if (confirm('¿Vaciar carrito?')) {
                    fetch('/api/carts/1', { method: 'DELETE' })
                    .then(r => r.json())
                    .then(d => {
                        if (d.status === 'success') {
                            alert('✅ Carrito vaciado');
                            location.reload();
                        }
                    });
                }
            }
        </script>
    </body>
    </html>
  `);
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running perfectly!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    status: 'success',
    payload: products,
    total: products.length
  });
});

app.get('/api/products/:pid', (req, res) => {
  const product = products.find(p => p._id === req.params.pid);
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Producto no encontrado'
    });
  }
  res.json({
    status: 'success',
    payload: product
  });
});

app.get('/api/carts/:cid', (req, res) => {
  const cart = carts.find(c => c._id === req.params.cid);
  if (!cart) {
    return res.status(404).json({
      status: 'error',
      message: 'Carrito no encontrado'
    });
  }
  
  const cartWithProducts = {
    ...cart,
    products: cart.products.map(item => ({
      product: products.find(p => p._id === item.product),
      quantity: item.quantity
    }))
  };
  
  res.json({
    status: 'success',
    payload: cartWithProducts
  });
});

app.post('/api/carts/:cid/products/:pid', (req, res) => {
  const cart = carts.find(c => c._id === req.params.cid);
  const product = products.find(p => p._id === req.params.pid);
  
  if (!cart) {
    return res.status(404).json({
      status: 'error',
      message: 'Carrito no encontrado'
    });
  }
  
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Producto no encontrado'
    });
  }
  
  const existingItem = cart.products.find(item => item.product === req.params.pid);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.products.push({
      product: req.params.pid,
      quantity: 1
    });
  }
  
  res.json({
    status: 'success',
    message: 'Producto agregado al carrito exitosamente'
  });
});

app.delete('/api/carts/:cid/products/:pid', (req, res) => {
  const cart = carts.find(c => c._id === req.params.cid);
  if (!cart) {
    return res.status(404).json({
      status: 'error',
      message: 'Carrito no encontrado'
    });
  }
  
  cart.products = cart.products.filter(item => item.product !== req.params.pid);
  
  res.json({
    status: 'success',
    message: 'Producto eliminado del carrito'
  });
});

app.delete('/api/carts/:cid', (req, res) => {
  const cart = carts.find(c => c._id === req.params.cid);
  if (!cart) {
    return res.status(404).json({
      status: 'error',
      message: 'Carrito no encontrado'
    });
  }
  
  cart.products = [];
  
  res.json({
    status: 'success',
    message: 'Carrito vaciado exitosamente'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada',
    path: req.path
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`\n🚀 E-commerce API funcionando en http://localhost:${PORT}`);
  console.log(`📱 Interfaz web: http://localhost:${PORT}`);
  console.log(`📦 Productos: http://localhost:${PORT}/products`);
  console.log(`🛒 Carrito: http://localhost:${PORT}/cart`);
  console.log(`\n🔗 APIs disponibles:`);
  console.log(`   • http://localhost:${PORT}/api/health`);
  console.log(`   • http://localhost:${PORT}/api/products`);
  console.log(`   • http://localhost:${PORT}/api/carts/1`);
  console.log(`\n✅ Servidor completamente funcional - Listo para usar`);
});
