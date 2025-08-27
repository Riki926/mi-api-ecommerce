const path = require('path');
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');

const ProductManager = require('./managers/ProductManager');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');

const app = express();
const PORT = 8080;

// Configuración de CORS (opcional para desarrollo)
app.use(cors({
    origin: '*', // Permite todas las conexiones en desarrollo
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// HTTP server + Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer);
app.set('io', io);

// Routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Websockets: alta y baja de productos
const productManager = new ProductManager();
io.on('connection', (socket) => {
    // Enviar lista inicial si se requiere
    // productManager.getProducts().then((products) => socket.emit('updateProducts', products));

    socket.on('addProduct', async (productData) => {
        try {
            await productManager.addProduct(productData);
            const products = await productManager.getProducts();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al agregar producto via WS:', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            const products = await productManager.getProducts();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al eliminar producto via WS:', error);
        }
    });
});

// Healthcheck simple
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
httpServer.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});