const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const { signJwt } = require('../utils/jwt');
const { requireAuth } = require('../middleware/auth');
const { UserCurrentDTO } = require('../dto/user.dto');

router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await userService.registerUser({
      first_name,
      last_name,
      email,
      age,
      password,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await userService.loginUser(email, password);

    const token = signJwt({ uid: user._id, role: user.role });

    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.get('/current', requireAuth, async (req, res) => {
  try {
    const userDTO = new UserCurrentDTO(req.user);
    res.json({ user: userDTO });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    await userService.requestPasswordReset(email);

    res.json({ sent: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reset', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    const result = await userService.resetPassword(token, newPassword);

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
