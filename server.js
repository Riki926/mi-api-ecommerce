const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let products = [
  { _id: '1', title: 'Smartphone', description: 'Teléfono inteligente', price: 599.99, stock: 15, category: 'electronics', status: true },
  { _id: '2', title: 'Laptop', description: 'Computadora portátil', price: 899.99, stock: 8, category: 'electronics', status: true },
  { _id: '3', title: 'Auriculares', description: 'Auriculares inalámbricos', price: 299.99, stock: 25, category: 'electronics', status: true }
];

let carts = [{ _id: '1', products: [{ product: '1', quantity: 2 }, { product: '2', quantity: 1 }] }];

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>E-commerce API</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <a class="navbar-brand" href="/">🛍️ E-commerce</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item"><a class="nav-link" href="/">Inicio</a></li>
                        <li class="nav-item"><a class="nav-link" href="/products">Productos</a></li>
                        <li class="nav-item"><a class="nav-link" href="/cart">Carrito</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        
        <div class="container mt-4">
            <h1>🚀 E-commerce API Demo</h1>
            <div class="row">
                <div class="col-md-8">
                    <h2>Productos</h2>
                    ${products.map(p => `
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5>${p.title}</h5>
                                <p>${p.description}</p>
                                <p><strong>$${p.price}</strong></p>
                                <button class="btn btn-primary" onclick="addToCart('${p._id}')">Agregar</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="col-md-4">
                    <h3>Enlaces API</h3>
                    <div class="list-group">
                        <a href="/api/v1/products" class="list-group-item" target="_blank">API Productos</a>
                        <a href="/api/v1/carts/1" class="list-group-item" target="_blank">API Carrito</a>
                        <a href="/api/v1/health" class="list-group-item" target="_blank">Health Check</a>
                    </div>
                </div>
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        <script>
            function addToCart(productId) {
                fetch(\`/api/v1/carts/1/products/\${productId}\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(data => alert(data.status === 'success' ? '✅ Agregado' : '❌ Error'));
            }
        </script>
    </body>
    </html>
  `);
});

app.get('/products', (req, res) => {
  res.send(`
    <h1>Productos</h1>
    ${products.map(p => `<div><h3>${p.title}</h3><p>$${p.price}</p></div>`).join('')}
    <a href="/">Volver</a>
  `);
});

app.get('/cart', (req, res) => {
  const cart = carts[0];
  const cartProducts = cart.products.map(item => ({
    ...item,
    product: products.find(p => p._id === item.product)
  }));
  
  res.send(`
    <h1>Carrito</h1>
    ${cartProducts.map(item => `
      <div>
        <h4>${item.product.title}</h4>
        <p>Cantidad: ${item.quantity}</p>
        <p>$${item.product.price}</p>
      </div>
    `).join('')}
    <a href="/">Volver</a>
  `);
});

// API Routes
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'success', message: 'Server OK', timestamp: new Date() });
});

app.get('/api/v1/products', (req, res) => {
  res.json({ status: 'success', payload: products });
});

app.get('/api/v1/carts/:cid', (req, res) => {
  const cart = carts.find(c => c._id === req.params.cid);
  if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
  
  const cartWithProducts = {
    ...cart,
    products: cart.products.map(item => ({
      product: products.find(p => p._id === item.product),
      quantity: item.quantity
    }))
  };
  
  res.json({ status: 'success', payload: cartWithProducts });
});

app.post('/api/v1/carts/:cid/products/:pid', (req, res) => {
  const cart = carts.find(c => c._id === req.params.cid);
  if (!cart) return res.status(404).json({ status: 'error' });
  
  const existingItem = cart.products.find(item => item.product === req.params.pid);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }
  
  res.json({ status: 'success', message: 'Producto agregado' });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor funcionando en http://localhost:${PORT}`);
  console.log(`📱 Página principal: http://localhost:${PORT}`);
  console.log(`📦 API Productos: http://localhost:${PORT}/api/v1/products`);
  console.log(`🛒 API Carrito: http://localhost:${PORT}/api/v1/carts/1`);
  console.log(`✅ Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`\n🎯 Proyecto 100% funcional`);
});
