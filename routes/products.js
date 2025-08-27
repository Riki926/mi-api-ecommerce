const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');

const router = Router();
const productManager = new ProductManager();

// GET / - Listar todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// GET /:pid - Obtener producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// POST / - Agregar nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);

        // Emitir actualización por websockets
        const io = req.app.get('io');
        if (io) {
            const products = await productManager.getProducts();
            io.emit('updateProducts', products);
        }

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /:pid - Actualizar producto
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = await productManager.updateProduct(pid, req.body);
        
        // Emitir actualización por websockets
        const io = req.app.get('io');
        if (io) {
            const products = await productManager.getProducts();
            io.emit('updateProducts', products);
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /:pid - Eliminar producto
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productManager.deleteProduct(pid);
        
        // Emitir actualización por websockets
        const io = req.app.get('io');
        if (io) {
            const products = await productManager.getProducts();
            io.emit('updateProducts', products);
        }

        res.json({ message: 'Producto eliminado exitosamente', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;