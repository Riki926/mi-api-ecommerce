const { Router } = require('express');
const mongoose = require('mongoose');
const ProductManager = require('../managers/ProductManager');

const router = Router();
const productManager = new ProductManager();

// GET / - Listar productos con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
    try {
        // Obtener y validar parámetros de consulta
        const limit = req.query.limit ? Math.max(1, parseInt(req.query.limit)) : 10;
        const page = req.query.page ? Math.max(1, parseInt(req.query.page)) : 1;
        const sort = req.query.sort === 'asc' || req.query.sort === 'desc' ? req.query.sort : null;
        const query = req.query.query || null;
        
        // Validar parámetros
        if (isNaN(limit) || isNaN(page) || (req.query.page && page < 1) || (req.query.limit && limit < 1)) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Parámetros de paginación inválidos' 
            });
        }

        const options = { limit, page, sort, query };
        const result = await productManager.getProducts(options);
        
        // Si no hay productos pero hay página solicitada mayor a 1, devolver error
        if (result.payload.length === 0 && page > 1) {
            return res.status(404).json({ 
                status: 'error',
                message: 'No se encontraron productos en la página solicitada' 
            });
        }

        res.json(result);
    } catch (error) {
        console.error('Error en GET /api/products:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Error interno del servidor al obtener productos' 
        });
    }
});

// GET /:pid - Obtener producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        
        // Validar que el ID tenga un formato válido
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID de producto inválido'
            });
        }
        
        const result = await productManager.getProductById(pid);
        
        if (!result) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error en GET /api/products/:pid:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor al obtener el producto'
        });
    }
});

// POST / - Agregar nuevo producto
router.post('/', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'El cuerpo de la solicitud no puede estar vacío'
            });
        }

        const result = await productManager.addProduct(req.body);

        // Emitir actualización por websockets
        const io = req.app.get('io');
        if (io) {
            const products = await productManager.getProducts({ limit: 10, page: 1 });
            io.emit('updateProducts', products);
        }

        res.status(201).json(result);
    } catch (error) {
        console.error('Error en POST /api/products:', error);
        res.status(400).json({
            status: 'error',
            message: error.message || 'Error al crear el producto'
        });
    }
});

// PUT /:pid - Actualizar producto
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        
        // Validar que el ID tenga un formato válido
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID de producto inválido'
            });
        }
        
        // Validar que el cuerpo de la solicitud no esté vacío
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'El cuerpo de la solicitud no puede estar vacío'
            });
        }
        
        const result = await productManager.updateProduct(pid, req.body);
        
        // Emitir actualización por websockets
        const io = req.app.get('io');
        if (io) {
            const products = await productManager.getProducts({ limit: 10, page: 1 });
            io.emit('updateProducts', products);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error en PUT /api/products/:pid:', error);
        res.status(400).json({
            status: 'error',
            message: error.message || 'Error al actualizar el producto'
        });
    }
});

// DELETE /:pid - Eliminar producto
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        
        // Validar que el ID tenga un formato válido
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID de producto inválido'
            });
        }
        
        const result = await productManager.deleteProduct(pid);
        
        // Emitir actualización por websockets
        const io = req.app.get('io');
        if (io) {
            const products = await productManager.getProducts({ limit: 10, page: 1 });
            io.emit('updateProducts', products);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error en DELETE /api/products/:pid:', error);
        res.status(400).json({
            status: 'error',
            message: error.message || 'Error al eliminar el producto'
        });
    }
});

module.exports = router;