const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const apiLimiter = require('../middlewares/rateLimiter');
router.post('/register', authController.register);
router.post('/login',apiLimiter, authController.login);
router.post('/refresh', authController.refresh);

module.exports = router;