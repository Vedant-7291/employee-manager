const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const requireEmployee = require('../middleware/roleMiddleware')('employee');
const upload = require("../middleware/upload");
const {
  getProfile,
  updateEmployeeProfile,
  checkTodayAttendance,
  getMyTasks,
  completeTask,
  undoTask,
  markAttendance,
  getEmployeeDirectory
} = require('../controllers/employeeController');

router.use(auth, requireEmployee);

// Profile routes
router.get('/profile', getProfile);
router.put(
  '/profile/:employeeId',
  upload.single("profile"),
  updateEmployeeProfile
);

// Attendance routes
router.get('/attendance/check', checkTodayAttendance);
router.post('/attendance', markAttendance);

// Task routes
router.get('/tasks', getMyTasks);
router.put('/tasks/:taskId/complete', completeTask);
router.put('/tasks/:taskId/undo', undoTask);

// Directory
router.get('/employee-directory', getEmployeeDirectory);

module.exports = router;