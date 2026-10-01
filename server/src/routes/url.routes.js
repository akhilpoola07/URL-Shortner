const express = require('express');
const UrlController = require('../controllers/url.controller');
const { authenticateToken, optionalToken } = require('../middleware/auth.middleware');
const { urlCreationLimiter } = require('../middleware/rateLimiter.middleware');

const router = express.Router();

// Create URL (can accept authenticated users or optional fallback if needed, but for logged in user management require auth)
router.post('/', authenticateToken, urlCreationLimiter, UrlController.createUrl);
router.get('/', authenticateToken, UrlController.getUrls);
router.get('/:id', authenticateToken, UrlController.getUrlById);
router.patch('/:id', authenticateToken, UrlController.updateUrl);
router.delete('/:id', authenticateToken, UrlController.deleteUrl);

module.exports = router;
