const express = require('express');
const router = express.Router();
const { register, login, updateOnlineStatus } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Authenticated routes
router.patch('/online-status', auth, updateOnlineStatus);

module.exports = router;