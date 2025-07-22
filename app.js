const express = require('express');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const PORT = 8080;

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de Ecommerce funcionando correctamente',
        endpoints: {
            products: '/api/products',
            carts: '/api/carts'
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

module.exports = app; 