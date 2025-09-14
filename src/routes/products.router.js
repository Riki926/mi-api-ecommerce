const { Router } = require('express');
const { getProducts } = require('../controllers/products.controller');

const router = Router();

// GET /api/products
router.get('/', getProducts);

module.exports = router;
