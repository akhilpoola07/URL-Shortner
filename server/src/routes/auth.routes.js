const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');

const router = express.Router();

router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);
router.get('/me', authenticateToken, AuthController.getCurrentUser);
router.post('/logout', AuthController.logout);
router.patch('/profile', authenticateToken, AuthController.updateProfile);

module.exports = router;
