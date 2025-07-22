const express = require('express');
const CartManager = require('../managers/CartManager');

const router = express.Router();
const cartManager = new CartManager();

// POST / - Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        
        res.status(201).json({
            status: 'success',
            message: 'Carrito creado exitosamente',
            payload: newCart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// GET /:cid - Listar productos de un carrito
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);
        
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        res.json({
            status: 'success',
            payload: cart.products
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// POST /:cid/product/:pid - Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        
        res.json({
            status: 'success',
            message: 'Producto agregado al carrito exitosamente',
            payload: updatedCart
        });
    } catch (error) {
        if (error.message === 'Carrito no encontrado') {
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