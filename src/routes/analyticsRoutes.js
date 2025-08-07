const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/admin', authenticateUser,authorizeRoles('admin'), analyticsController.getAdminStats);
router.get('/user', authenticateUser, analyticsController.getUserStats);

module.exports = router;