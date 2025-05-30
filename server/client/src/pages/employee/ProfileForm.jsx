import React, { useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const ProfileForm = ({ onClose, onUpdateUser }) => {
  const { user, setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    department: user?.department || "",
    phone: user?.phone || "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const departments = [
    { value: "", label: "Select Department" },
    { value: "Full Stack", label: "Full Stack" },
    { value: "Frontend", label: "Frontend" },
    { value: "Backend", label: "Backend" },
    { value: "Designer", label: "Designer" },
    { value: "DSA", label: "DSA" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      
      data.append("name", formData.name);
      data.append("department", formData.department);
      data.append("phone", formData.phone);
      if (profileImage) data.append("profile", profileImage);
  
      const res = await axios.put(
        `http://localhost:5000/api/employee/update-profile/${user._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }
      );
  
      if (!res.data.user) {
        throw new Error("No user data returned from server");
      }
  
      const updatedUser = {
        ...res.data.user,
        token: user.token
      };
  
      setUser(updatedUser);
      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      localStorage.setItem("token", token);
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
  
      onClose();
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Update Profile
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <motion.div 
              className="p-3 bg-red-100 text-red-700 rounded-lg text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
            >
              {departments.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <label className="flex-1">
                <div className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="text-sm text-gray-700">Choose file</span>
                  <input
                    type="file"
                    name="profile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </label>
              {profileImage && (
                <motion.span 
                  className="text-sm text-green-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Selected
                </motion.span>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all flex justify-center items-center ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProfileForm;