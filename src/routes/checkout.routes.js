const express = require('express');
const router = express.Router();
const checkoutService = require('../services/checkout.service');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('user'));

router.post('/purchase', async (req, res) => {
  try {
    const result = await checkoutService.purchase(req.user._id, req.user.email);

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
