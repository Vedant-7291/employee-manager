import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../../store/useAuthStore';

const AttendanceButton = () => {
  const { user } = useAuthStore();
  const [marked, setMarked] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [markedTime, setMarkedTime] = useState('');

  useEffect(() => {
    const checkTodayAttendance = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const res = await axios.get(`/api/employee/attendance/check?date=${today}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setMarked(res.data.marked);
        if (res.data.marked && res.data.attendance) {
          const time = new Date(res.data.attendance.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setMarkedTime(time);
          setMessage(`Attendance marked at ${time}`);
        }
      } catch (err) {
        console.error('Error checking attendance:', err);
      } finally {
        setLoading(false);
      }
    };
    checkTodayAttendance();
  }, [user.token]);

  const markAttendance = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/employee/attendance', {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setMarked(true);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMarkedTime(time);
      setMessage(`Attendance marked at ${time}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error marking attendance');
      if (err.response?.status === 400) {
        setMarked(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 text-center">
      <button
        onClick={markAttendance}
        disabled={marked || loading}
        className={`px-6 py-2 rounded-md font-semibold ${
          marked 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700 text-white'
        } ${loading ? 'animate-pulse' : ''}`}
      >
        {loading ? 'Checking...' : marked ? '✅ Attendance Marked' : 'Mark Attendance'}
      </button>
      {message && <p className="mt-2 text-sm text-green-700">{message}</p>}
    </div>
  );
};

export default AttendanceButton;