const User = require('../models/User');
const Task = require('../models/Task');
const Attendance = require('../models/Attendance');

// Get own profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile - Fixed version
const updateEmployeeProfile = async (req, res) => {
  try {
    const { name, phone, department } = req.body;
    const profile = req.file ? req.file.path : undefined;

    const employee = await User.findById(req.params.employeeId); // ✅ Fixed line
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (name) employee.name = name;
    if (phone) employee.phone = phone;
    if (department) employee.department = department;
    if (profile) employee.profile = profile;

    const updatedEmployee = await employee.save();

    const userResponse = updatedEmployee.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: userResponse._id,
        name: userResponse.name,
        email: userResponse.email,
        profile: userResponse.profile,
        department: userResponse.department,
        role: userResponse.role
      },
      token: req.header('Authorization')?.split(' ')[1]
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      message: "Error updating profile",
      error: error.message
    });
  }
};

// Check today's attendance
const checkTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      user: req.user._id,
      date: { $gte: today }
    });
    
    res.json({ marked: !!attendance });
  } catch (err) {
    res.status(500).json({ message: 'Error checking attendance' });
  }
};

// View tasks assigned to self
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id });
    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Mark task as completed
const completeTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, assignedTo: req.user._id },
      { status: 'completed' },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error("Complete task error:", err);
    res.status(500).json({ message: 'Error completing task' });
  }
};

// Undo completed task
const undoTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, assignedTo: req.user._id },
      { status: 'pending' },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error("Undo task error:", err);
    res.status(500).json({ message: 'Error undoing task' });
  }
};

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyMarked = await Attendance.findOne({
      user: req.user._id,
      date: today,
    });

    if (alreadyMarked) {
      return res.status(400).json({ message: 'Attendance already marked today' });
    }

    const attendance = new Attendance({ user: req.user._id });
    await attendance.save();

    res.json({ message: 'Attendance marked successfully' });
  } catch (err) {
    console.error("Mark attendance error:", err);
    res.status(500).json({ message: 'Error marking attendance' });
  }
};
const getEmployeeDirectory = async (req, res) => {
  try {
    const employees = await User.find({})
      .select('name profile isOnline lastActive')
      .sort({ isOnline: -1, name: 1 });
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employee directory:', err);
    res.status(500).json({ message: 'Error fetching employee directory' });
  }
};

module.exports = {
  getProfile,
  updateEmployeeProfile,
  getMyTasks,
  completeTask,
  undoTask,
  markAttendance,
  checkTodayAttendance,
  getEmployeeDirectory
};
