const express = require('express');
const RedirectController = require('../controllers/redirect.controller');

const router = express.Router();

router.get('/:shortCode', RedirectController.handleRedirect);

module.exports = router;
