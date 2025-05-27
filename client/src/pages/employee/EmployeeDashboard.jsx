import React, { useEffect, useState, useRef } from "react";
import useAuthStore from "../../store/useAuthStore";
import ProfileForm from "./ProfileForm";
import TaskView from "./TaskView";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AttendanceButton from "./AttendanceButton";
import EmployeeDirectory from "./EmployeeDirectory";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


// Initialize GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const EmployeeDashboard = () => {
  const { user, clearUser } = useAuthStore();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const navigate = useNavigate();
  const dashboardRef = useRef();
  const headerRef = useRef();
  const sectionRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Only run animations if user data is available
    

    
  }, [user]);

  const handleProfileUpdate = () => {
    setShowProfileForm(false);
  };

  const handleLogout = () => {
    clearUser();
    navigate('/login');
  };

  // Add a safeguard for missing user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8 font-sans">
      <motion.div
        ref={dashboardRef}
        className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      >
        {/* Header Section */}
        <motion.div 
          ref={headerRef}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4">
              <motion.img
                src={user?.profile || `https://ui-avatars.com/api/?background=random&name=${user?.name}`}
                alt="Profile"
                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full cursor-pointer border-4 border-white/30 shadow-lg"
                onClick={() => setShowProfileForm(true)}
                whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  Welcome, {user?.name}
                </h1>
                <p className="text-blue-100">
                  {user?.department || 'No department assigned'}
                </p>
              </div>
            </div>

            <motion.button
              onClick={handleLogout}
              className="mt-4 md:mt-0 px-5 py-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20 flex items-center space-x-2 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Logout</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="p-6 md:p-8 space-y-8">
          <AnimatePresence>
            {showProfileForm && (
              <ProfileForm 
                onClose={() => setShowProfileForm(false)} 
                onUpdateUser={handleProfileUpdate}
              />
            )}
          </AnimatePresence>

          {/* Tasks Section */}
          <section
            ref={el => sectionRefs.current[0] = el}
            className="bg-gray-50 rounded-xl p-6 shadow-inner border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Your Tasks
              </h2>
            </div>
            <TaskView />
          </section>

          {/* Attendance Section */}
          <section
            ref={el => sectionRefs.current[1] = el}
            className="bg-gray-50 rounded-xl p-6 shadow-inner border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Daily Attendance
              </h2>
            </div>
            <AttendanceButton />
          </section>

          {/* Team Directory Section */}
          <section
            ref={el => sectionRefs.current[2] = el}
            className="bg-gray-50 rounded-xl p-6 shadow-inner border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Team Directory
              </h2>
            </div>
            <div className="flex flex-col space-y-4">
              <p className="text-gray-600">
                View your colleagues' availability and contact information
              </p>
              <EmployeeDirectory />
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default EmployeeDashboard;