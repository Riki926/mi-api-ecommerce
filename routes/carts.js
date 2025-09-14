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

// GET /:cid - Obtener productos del carrito con populate
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartByIdWithProducts(cid);
        
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

// DELETE /:cid/products/:pid - Eliminar producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.removeProductFromCart(cid, pid);
        
        res.json({ message: 'Producto eliminado del carrito exitosamente', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /:cid - Actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        
        if (!Array.isArray(products)) {
            return res.status(400).json({ error: 'products debe ser un array' });
        }
        
        const updatedCart = await cartManager.updateCartProducts(cid, products);
        res.json({ message: 'Carrito actualizado exitosamente', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /:cid/products/:pid - Actualizar cantidad de un producto específico
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        
        if (quantity === undefined || quantity < 0) {
            return res.status(400).json({ error: 'quantity es requerido y debe ser mayor o igual a 0' });
        }
        
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json({ message: 'Cantidad actualizada exitosamente', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /:cid - Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const updatedCart = await cartManager.clearCart(cid);
        
        res.json({ message: 'Carrito vaciado exitosamente', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;