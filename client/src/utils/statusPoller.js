import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

let intervalId = null;

export const startStatusPoller = () => {
  const { token, isAuthenticated } = useAuthStore.getState();
  
  if (!isAuthenticated || intervalId) return;

  // Update status every 30 seconds
  intervalId = setInterval(async () => {
    try {
      await axios.patch('/api/auth/online-status', { isOnline: true }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Status update error:', err);
    }
  }, 30000);
};

export const stopStatusPoller = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};