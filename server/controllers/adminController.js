const User = require('../models/User');
const Task = require('../models/Task');
const Attendance = require('../models/Attendance');

// Create task for employee
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id
    });

    await task.save();
    
    // Populate the assignedTo field in response
    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email');
    res.status(201).json(populatedTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
};
// Update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

// Get all employees
// In your adminController.js
const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('name email profile department role isOnline lastActive'); // Include all needed fields
     console.log('Sending employees data:', employees.map(e => ({
      name: e.name,
      isOnline: e.isOnline,
      lastActive: e.lastActive
    })));
    res.status(200).json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Error fetching employees' });
  }
};

// Get one employee's profile
const getEmployeeProfile = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select('-password');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Remove employee


const removeEmployee = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const user = await User.findByIdAndDelete(employeeId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};




// Completed tasks
const getCompletedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'completed' }).populate('assignedTo', 'name');
    res.status(200).json({ tasks });

    
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching completed tasks' });
  }
};


// Attendance: last 30 days
const getAttendance = async (req, res) => {
  try {
    const from = new Date();
    from.setDate(from.getDate() - 30);

    const attendance = await Attendance.find({
      user: req.params.id,
      date: { $gte: from }
    }).sort({ date: -1 });

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance' });
  }
};
// VS Code status: online/offline
const getEmployeeStatuses = async (req, res) => {
  try {
    const users = await User.find({ role: 'employee' }).select('name email isOnline lastActive');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching statuses' });
  }
};
// GET /api/admin/completed-tasks
module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getAllEmployees,
  getEmployeeProfile,
  getAttendance,
  getEmployeeStatuses,
  getCompletedTasks,
  removeEmployee
};
