
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';

const EmployeeDirectory = () => {
  const { user } = useAuthStore();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('/api/employee/employee-directory', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setEmployees(res.data);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const formatLastActive = (lastActive) => {
    if (!lastActive) return 'Never';
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffInMinutes = Math.floor((now - lastActiveDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <motion.div
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold">Employee Directory</h1>
          <p className="text-blue-100">View your colleagues' availability</p>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employees.filter(e => e._id !== user._id).map(emp => (
                <motion.div
                  key={emp._id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={emp.profile || `https://ui-avatars.com/api/?name=${emp.name}&background=random`}
                        alt={`${emp.name}'s profile`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        emp.isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{emp.name}</h3>
                      <div className="flex items-center mt-1">
                        
                        <span className="text-xs text-gray-500">
                          {emp.isOnline ? 'Online now' : `Offline (${formatLastActive(emp.lastActive)})`}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EmployeeDirectory;