const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createTask,
  updateTask,
  deleteTask,
  getAllEmployees,
  getEmployeeProfile,
  getAttendance,
  getEmployeeStatuses,
  getCompletedTasks,
  removeEmployee
} = require('../controllers/adminController');

// Apply middleware once
router.use(authMiddleware, roleMiddleware('admin'));

// Task management
router.post('/task', createTask);
router.put('/task/:taskId', updateTask);
router.delete('/task/:taskId', deleteTask);

// Employee management
router.get('/employees', getAllEmployees);
router.get('/employee/:employeeId', getEmployeeProfile);
router.delete('/employee/:employeeId', removeEmployee);  // Consolidated removal endpoint

// Task status/analytics
router.get('/employee/:employeeId/tasks', getCompletedTasks);
router.get('/employee/:employeeId/attendance', getAttendance);
router.get('/completed-tasks', getCompletedTasks);

// Online status
router.get('/status', getEmployeeStatuses);

module.exports = router;