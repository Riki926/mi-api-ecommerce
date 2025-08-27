const { Router } = require('express');
const CartManager = require('../managers/CartManager');

const router = Router();
const cartManager = new CartManager();

// POST / - Crear nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// GET /:cid - Obtener productos del carrito
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);
        
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// POST /:cid/product/:pid - Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

module.exports = router;