const express = require('express');
const AnalyticsController = require('../controllers/analytics.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/overview', authenticateToken, AnalyticsController.getOverviewAnalytics);
router.get('/urls/:id', authenticateToken, AnalyticsController.getUrlAnalytics);

module.exports = router;
