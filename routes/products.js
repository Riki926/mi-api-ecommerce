const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

// GET / - Listar todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json({
            status: 'success',
            payload: products
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// GET /:pid - Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        
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
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// POST / - Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await productManager.addProduct(productData);
        
        res.status(201).json({
            status: 'success',
            message: 'Producto creado exitosamente',
            payload: newProduct
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// PUT /:pid - Actualizar un producto
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updateData = req.body;
        
        const updatedProduct = await productManager.updateProduct(pid, updateData);
        
        res.json({
            status: 'success',
            message: 'Producto actualizado exitosamente',
            payload: updatedProduct
        });
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            res.status(404).json({
                status: 'error',
                message: error.message
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }
});

// DELETE /:pid - Eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productManager.deleteProduct(pid);
        
        res.json({
            status: 'success',
            message: 'Producto eliminado exitosamente',
            payload: deletedProduct
        });
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            res.status(404).json({
                status: 'error',
                message: error.message
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
});

module.exports = router; 