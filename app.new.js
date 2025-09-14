const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config({ path: './config/config.env' });

// Importar rutas
const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');
const authRouter = require('./routes/auth');
const viewsRouter = require('./routes/views');

// Importar utilidades
const { connectMongo } = require('./src/db/mongo');
const errorHandler = require('./middleware/error');
const logger = require('./middleware/logger');
const ErrorResponse = require('./utils/errorResponse');

// Inicializar la aplicación
const app = express();

// Crear servidor HTTP
const server = createServer(app);

// Configurar WebSockets
const io = new Server(server);
app.set('io', io);

// Middleware para parsear el body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Sanitizar datos contra NoSQL injection
app.use(mongoSanitize());

// Prevenir XSS attacks
app.use(xss());

// Prevenir HTTP Parameter Pollution
app.use(hpp());

// Configurar CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Configurar rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // límite de peticiones por ventana
  message: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// Logger de desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Headers de seguridad
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Handlebars
const hbs = engine({
  defaultLayout: 'main',
  helpers: {
    eq: function(a, b) { return a === b; },
    multiply: function(a, b) { return (a * b).toFixed(2); },
    calculateTotal: function(products) {
      return products.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2);
    },
    range: function(start, end) {
      const result = [];
      for (let i = start; i <= end; i++) result.push(i);
      return result;
    }
  }
});

app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Importar ProductManager
const ProductManager = require('./managers/ProductManager');
const productManager = new ProductManager();

// Configurar WebSockets
function configureWebSockets() {
  io.on('connection', (socket) => {
    console.log('Cliente conectado a WebSocket');

    // Enviar lista inicial de productos
    productManager.getProducts({ limit: 10, page: 1 })
      .then(products => {
        socket.emit('updateProducts', products);
      })
      .catch(error => {
        console.error('Error al obtener productos iniciales:', error);
      });

    socket.on('addProduct', async (productData) => {
      try {
        await productManager.addProduct(productData);
        const products = await productManager.getProducts({ limit: 10, page: 1 });
        io.emit('updateProducts', products);
      } catch (error) {
        console.error('Error al agregar producto:', error);
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('deleteProduct', async (productId) => {
      try {
        await productManager.deleteProduct(productId);
        const products = await productManager.getProducts({ limit: 10, page: 1 });
        io.emit('updateProducts', products);
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado de WebSocket');
    });
  });
}

// Rutas de la API
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/carts', cartsRouter);
app.use('/api/v1/auth', authRouter);

// Rutas de vistas
app.use('/', viewsRouter);

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta para manejar rutas no encontradas (404)
app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Middleware de manejo de errores
app.use(errorHandler);

// Configuración de WebSockets
configureWebSockets();

// Iniciar servidor
async function startServer() {
  try {
    // Verificar que la URI de MongoDB esté configurada
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('No se ha configurado la variable de entorno MONGODB_URI. Por favor, asegúrate de que el archivo .env contenga la cadena de conexión a MongoDB.');
    }
    
    console.log('🔌 Configuración de MongoDB:');
    console.log('   - Host: ' + (mongoUri.includes('@') ? mongoUri.split('@')[1].split('/')[0] : 'localhost:27017'));
    console.log('   - Base de datos: ' + (mongoUri.split('/').pop().split('?')[0] || 'ecommerce'));
    
    // Conectar a MongoDB
    console.log('\n🔍 Estableciendo conexión con MongoDB...');
    await connectMongo(mongoUri);
    
    // Iniciar el servidor HTTP
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
      console.log(`\n✅ Servidor listo en http://localhost:${PORT}`);
      console.log('   - API REST: /api/v1/products y /api/v1/carts');
      console.log('   - Autenticación: /api/v1/auth');
      console.log('   - Vistas: /');
      console.log('   - Health Check: /api/v1/health');
      console.log('\n🔧 Modo: ' + (process.env.NODE_ENV || 'development'));
      console.log('📝 Logs: consola y archivos en /logs');
    });
    
  } catch (error) {
    console.error('\n❌ Error crítico al iniciar el servidor:');
    console.error('   - Mensaje:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Posibles soluciones:');
      console.error('1. Verifica tu conexión a internet');
      console.error('2. Asegúrate de que MongoDB esté en ejecución');
      console.error('3. Verifica que la cadena de conexión en .env sea correcta');
    }
    
    process.exit(1);
  }
}

// Manejar excepciones no capturadas
process.on('unhandledRejection', (err, promise) => {
  console.error('Error:', err.message);
  // Cerrar servidor y salir del proceso
  server.close(() => process.exit(1));
});

// Iniciar la aplicación
startServer();
