const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const requireEmployee = require('../middleware/roleMiddleware')('employee');
const vscodeController = require('../controllers/vscodeController');

router.use(auth, requireEmployee);

// Employee pings this when active in VS Code
router.post('/ping', vscodeController.pingActivity);

module.exports = router;
