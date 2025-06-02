import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';

function EmployeeList({ updatedUser, onProfileUpdate }) {
  const { user } = useAuthStore();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentEmployeeData, setCurrentEmployeeData] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const departments = ['Full Stack', 'Frontend', 'Backend', 'Designer', 'DSA'];

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`https://employee-manager-11.onrender.com/api/admin/employees?cache=${Date.now()}`, {
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

  useEffect(() => {
    fetchEmployees();
    const interval = setInterval(fetchEmployees, 30000);
    return () => clearInterval(interval);
  }, [lastUpdated, updatedUser]);

  useEffect(() => {
    if (selectedEmployee) {
      const updatedData = employees.find(e => e._id === selectedEmployee._id);
      if (updatedData) setCurrentEmployeeData(updatedData);
    }
  }, [employees, selectedEmployee]);

  const refreshEmployees = () => {
    setLastUpdated(new Date());
  };

  const formatLastActive = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const lastActive = new Date(date);
    const diffInMinutes = Math.floor((now - lastActive) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      await axios.delete(`https://employee-manager-11.onrender.com/api/admin/employee/${employeeId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEmployees(prev => prev.filter(emp => emp._id !== employeeId));
      if (selectedEmployee?._id === employeeId) setSelectedEmployee(null);
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const fetchAttendance = async (employeeId) => {
    try {
      const res = await axios.get(`/api/admin/employee/${employeeId}/attendance`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setAttendanceData(res.data);
      setShowAttendanceModal(true);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h3 
          className="text-lg font-semibold text-gray-700"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Employee Directory
        </motion.h3>
        <div className="flex items-center gap-3">
          {isLoading && (
            <motion.div 
              className="flex items-center text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </motion.div>
          )}
          <motion.button
            onClick={refreshEmployees}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-xl shadow-sm hover:shadow-md transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Grouped by Department */}
      <div className="space-y-8">
        {departments.map((dept, deptIndex) => {
          const deptEmployees = employees.filter(emp => emp.department === dept);
          if (deptEmployees.length === 0) return null;

          return (
            <motion.div 
              key={dept} 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (deptIndex * 0.05) }}
            >
              <motion.h4 
                className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center gap-2"
                whileHover={{ x: 5 }}
              >
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 w-2 h-6 rounded-full"></span>
                {dept} Team
              </motion.h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deptEmployees.map((emp, empIndex) => (
                  <motion.div
                    key={emp._id}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group"
                    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.1 + (deptIndex * 0.05) + (empIndex * 0.03),
                      type: "spring",
                      stiffness: 300,
                      damping: 15
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="relative"
                        whileHover={{ rotate: 5 }}
                      >
                        <img
                          src={emp.profile || `https://ui-avatars.com/api/?name=${emp.name}&background=random`}
                          alt={`${emp.name}'s profile`}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          emp.isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                        }`}></div>
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{emp.name}</h4>
                        <p className="text-sm text-gray-600">{emp.email}</p>
                        <p className="text-xs text-blue-600 mt-1">{emp.department || 'No department'}</p>
                        <div className="flex items-center mt-1">
                          <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                            emp.isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                          }`}></span>
                          <span className="text-xs text-gray-500">
                            {emp.isOnline ? 'Online now' : `Offline (${formatLastActive(emp.lastActive)})`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <motion.div 
                      className="mt-4 flex gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.button
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm flex-1 transition-colors flex items-center justify-center gap-1"
                        onClick={() => setSelectedEmployee(emp)}
                        whileHover={{ scale: 1.03, backgroundColor: '#EFF6FF' }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </motion.button>
                      <motion.button
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm flex-1 transition-colors flex items-center justify-center gap-1"
                        onClick={() => handleDelete(emp._id)}
                        whileHover={{ scale: 1.03, backgroundColor: '#FEE2E2' }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </motion.button>
                      <motion.button
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg text-sm flex-1 transition-colors flex items-center justify-center gap-1"
                        onClick={() => fetchAttendance(emp._id)}
                        whileHover={{ scale: 1.03, backgroundColor: '#F3E8FF' }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Attendance
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* Other Employees */}
        {employees.filter(emp => !departments.includes(emp.department)).length > 0 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.h4 
              className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center gap-2"
              whileHover={{ x: 5 }}
            >
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 w-2 h-6 rounded-full"></span>
              Other Employees
            </motion.h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.filter(emp => !departments.includes(emp.department)).map((emp, index) => (
                <motion.div
                  key={emp._id}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group"
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.3 + (index * 0.03),
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="relative"
                      whileHover={{ rotate: 5 }}
                    >
                      <img
                        src={emp.profile || `https://ui-avatars.com/api/?name=${emp.name}&background=random`}
                        alt={`${emp.name}'s profile`}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        emp.isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                      }`}></div>
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{emp.name}</h4>
                      <p className="text-sm text-gray-600">{emp.email}</p>
                      <p className="text-xs text-blue-600 mt-1">{emp.department || 'No department'}</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          emp.isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                        }`}></span>
                        <span className="text-xs text-gray-500">
                          {emp.isOnline ? 'Online now' : `Offline (${formatLastActive(emp.lastActive)})`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.div 
                    className="mt-4 flex gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.button
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm flex-1 transition-colors flex items-center justify-center gap-1"
                      onClick={() => setSelectedEmployee(emp)}
                      whileHover={{ scale: 1.03, backgroundColor: '#EFF6FF' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </motion.button>
                    <motion.button
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm flex-1 transition-colors flex items-center justify-center gap-1"
                      onClick={() => handleDelete(emp._id)}
                      whileHover={{ scale: 1.03, backgroundColor: '#FEE2E2' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </motion.button>
                    <motion.button
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg text-sm flex-1 transition-colors flex items-center justify-center gap-1"
                      onClick={() => fetchAttendance(emp._id)}
                      whileHover={{ scale: 1.03, backgroundColor: '#F3E8FF' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Attendance
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Employee Detail Modal */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.3
              }}
            >
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white relative">
                <motion.button
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1"
                  onClick={() => setSelectedEmployee(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
                
                <motion.div className="flex flex-col items-center">
                  <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                    <img
                      src={(currentEmployeeData || selectedEmployee).profile || `https://ui-avatars.com/api/?name=${(currentEmployeeData || selectedEmployee).name}&background=random`}
                      alt={`${(currentEmployeeData || selectedEmployee).name}'s profile`}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white/80 shadow-lg mb-4"
                    />
                    <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${
                      (currentEmployeeData || selectedEmployee).isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                    }`}></div>
                  </motion.div>
                  
                  <motion.h3 className="text-2xl font-bold">
                    {(currentEmployeeData || selectedEmployee).name}
                  </motion.h3>
                  <motion.p className="text-blue-100 mt-1">
                    {(currentEmployeeData || selectedEmployee).role}
                  </motion.p>
                </motion.div>
              </div>

              <motion.div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div 
                    className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 hover:shadow-sm transition-shadow"
                    whileHover={{ y: -2 }}
                  >
                    <p className="text-sm font-medium text-blue-600 mb-1">Email</p>
                    <p className="text-gray-800">{(currentEmployeeData || selectedEmployee).email}</p>
                  </motion.div>

                  <motion.div 
                    className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 hover:shadow-sm transition-shadow"
                    whileHover={{ y: -2 }}
                  >
                    <p className="text-sm font-medium text-indigo-600 mb-1">Department</p>
                    <p className="text-gray-800">{(currentEmployeeData || selectedEmployee).department || 'Not specified'}</p>
                  </motion.div>
                </div>

                <motion.div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Employee Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Status</span>
                      <span className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          (currentEmployeeData || selectedEmployee).isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                        }`}></span>
                        <span className="text-gray-800">
                          {(currentEmployeeData || selectedEmployee).isOnline ? 'Online' : 'Offline'}
                        </span>
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Last Active</span>
                      <span className="text-gray-800">
                        {(currentEmployeeData || selectedEmployee).isOnline 
                          ? 'Now' 
                          : (currentEmployeeData || selectedEmployee).lastActive 
                            ? formatLastActive((currentEmployeeData || selectedEmployee).lastActive)
                            : 'Never'
                        }
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since</span>
                      <span className="text-gray-800">
                        {new Date((currentEmployeeData || selectedEmployee).createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div className="flex gap-3 mt-6">
                  <motion.button
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedEmployee(null);
                      fetchAttendance((currentEmployeeData || selectedEmployee)._id);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    View Attendance
                  </motion.button>
                  
                  <motion.button
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedEmployee(null)}
                  >
                    Close
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attendance Modal */}
      <AnimatePresence>
        {showAttendanceModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
                <h3 className="text-xl font-semibold">Attendance Records</h3>
                <p className="text-sm text-blue-100">Last 30 days</p>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {attendanceData.length > 0 ? (
                  <div className="space-y-3">
                    {attendanceData.map((record) => {
                      const date = new Date(record.date);
                      const formattedDate = date.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      });
                      const formattedTime = date.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      });
                      
                      return (
                        <motion.div 
                          key={record._id} 
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:shadow-sm transition-all"
                          whileHover={{ x: 2 }}
                        >
                          <div>
                            <span className="text-gray-800 block">{formattedDate}</span>
                            <span className="text-gray-500 text-sm">{formattedTime}</span>
                          </div>
                          <span className="flex items-center text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Present
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="mt-2">No attendance records found</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-100 flex justify-end">
                <motion.button
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                  onClick={() => setShowAttendanceModal(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EmployeeList;
