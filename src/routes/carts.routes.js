const express = require('express');
const router = express.Router();
const cartService = require('../services/cart.service');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('user'));

router.get('/mine', async (req, res) => {
  try {
    const cart = await cartService.getOrCreateCartByUser(req.user._id);
    res.json({ cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/mine/items', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'productId and quantity are required' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    const cart = await cartService.addItem(req.user._id, productId, quantity);

    res.json({ cart });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/mine/items/:productId', async (req, res) => {
  try {
    const cart = await cartService.removeItem(req.user._id, req.params.productId);
    res.json({ cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/mine', async (req, res) => {
  try {
    const cart = await cartService.clear(req.user._id);
    res.json({ cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
