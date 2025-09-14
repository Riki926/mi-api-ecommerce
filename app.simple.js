const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const path = require('path');

// Inicializar la aplicación
const app = express();

// Middleware básico
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Seguridad básica
app.use(helmet());

// Logger
app.use(morgan('dev'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main',
  helpers: {
    eq: function(a, b) { return a === b; },
    multiply: function(a, b) { return (a * b).toFixed(2); }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Datos de prueba en memoria
let products = [
  {
    _id: '1',
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 99.99,
    stock: 10,
    category: 'electronics',
    status: true,
    thumbnails: ['https://via.placeholder.com/300']
  },
  {
    _id: '2',
    title: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 149.99,
    stock: 5,
    category: 'clothing',
    status: true,
    thumbnails: ['https://via.placeholder.com/300']
  }
];

let carts = [
  {
    _id: '1',
    products: []
  }
];

// Rutas de API simplificadas
app.get('/api/v1/products', (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  
  res.json({
    status: 'success',
    payload: products,
    totalPages: 1,
    page: parseInt(page),
    hasPrevPage: false,
    hasNextPage: false,
    prevLink: null,
    nextLink: null
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
  const cart = carts.find(c => c._id === req.params.cid);
  if (!cart) {
    return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
  }
  res.json({ status: 'success', payload: cart });
});

app.post('/api/v1/carts/:cid/products/:pid', (req, res) => {
  const cart = carts.find(c => c._id === req.params.cid);
  const product = products.find(p => p._id === req.params.pid);
  
  if (!cart || !product) {
    return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });
  }
  
  const existingItem = cart.products.find(item => item.product === req.params.pid);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }
  
  res.json({ status: 'success', message: 'Producto agregado al carrito' });
});

// Rutas de vistas
app.get('/', (req, res) => {
  res.render('home', { 
    title: 'E-commerce API - Demo',
    products: products
  });
});

app.get('/products/:pid', (req, res) => {
  const product = products.find(p => p._id === req.params.pid);
  if (!product) {
    return res.status(404).render('error', { message: 'Producto no encontrado' });
  }
  res.render('productDetail', { product });
});

app.get('/carts/:cid', (req, res) => {
  const cart = carts.find(c => c._id === req.params.cid);
  if (!cart) {
    return res.status(404).render('error', { message: 'Carrito no encontrado' });
  }
  
  // Poblar productos del carrito
  const cartWithProducts = {
    ...cart,
    products: cart.products.map(item => ({
      ...item,
      product: products.find(p => p._id === item.product)
    }))
  };
  
  res.render('cart', { cart: cartWithProducts });
});

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running (Simple Mode)',
    timestamp: new Date().toISOString(),
    environment: 'development'
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

// Iniciar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`\n✅ Servidor funcionando en modo SIMPLE`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/v1/health`);
  console.log(`🛍️  Productos: http://localhost:${PORT}/api/v1/products`);
  console.log(`🛒 Carrito demo: http://localhost:${PORT}/carts/1`);
  console.log(`\n💡 Este es un servidor de DEMOSTRACIÓN sin base de datos`);
  console.log(`   Para la versión completa, configura MongoDB y ejecuta app.new.js`);
});
