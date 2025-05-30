import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance'; // auto-attaches token & baseURL
import { motion } from 'framer-motion';

const TaskAssignForm = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('/admin/employees');
        setEmployees(res.data);
        console.log(res.data)
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        setError('Unauthorized or failed to load employees');
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/admin/task', formData);
      console.log('Task created:', response.data); // Log response
      setSuccess('Task assigned successfully!');
      setFormData({ title: '', description: '', assignedTo: '' });
      setError('');
    } catch (err) {
      console.error('Error assigning task:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to assign task');
      setSuccess('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {error && (
        <motion.div
          className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {success}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
          <motion.div whileHover={{ scale: 1.01 }}>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-black"
              placeholder="Enter task title"
            />
          </motion.div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <motion.div whileHover={{ scale: 1.01 }}>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all min-h-[120px] text-black"
              placeholder="Describe the task details..."
            />
          </motion.div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
          <motion.div whileHover={{ scale: 1.01 }}>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all appearance-none bg-white text-black"
            >
              <option value="">Select an employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id} className='text-black'>
                  {emp.name} ({emp.department || 'No dept'})
                </option>
              ))}
            </select>
          </motion.div>
        </div>

        <motion.button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          Assign Task
        </motion.button>
      </form>
    </motion.div>
  );
};

export default TaskAssignForm;