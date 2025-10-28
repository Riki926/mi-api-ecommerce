const express = require('express');
const router = express.Router();
const productService = require('../services/product.service');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { title, description, price, stock, owner } = req.body;

    if (!title || !price || stock === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = await productService.createProduct({
      title,
      description,
      price,
      stock,
      owner,
    });

    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully', product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
