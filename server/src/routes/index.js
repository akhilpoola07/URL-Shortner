const express = require('express');
const authRoutes = require('./auth.routes');
const urlRoutes = require('./url.routes');
const analyticsRoutes = require('./analytics.routes');
const { sendSuccess } = require('../utils/responseHandler');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    sendSuccess(res, 200, 'LinkShort API server is running healthy.', {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

router.use('/auth', authRoutes);
router.use('/urls', urlRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
