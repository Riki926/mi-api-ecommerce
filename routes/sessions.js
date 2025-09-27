const express = require('express');
const router = express.Router();
const { getCurrentUser } = require('../controllers/auth.controller');

// @desc    Get current logged in user
// @route   GET /api/sessions/current
// @access  Private (requires JWT token)
router.get('/current', getCurrentUser);

module.exports = router;
