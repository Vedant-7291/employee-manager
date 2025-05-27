import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set, get) => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isHydrated: false,
    isOnline: false // Add online status
  };

  return {
    ...initialState,

    initialize: async () => {
      if (get().isHydrated) return;
      
      try {
        const user = JSON.parse(localStorage.getItem('authUser')) || null;
        const token = localStorage.getItem('token') || null;
        
        set({
          user,
          token,
          isAuthenticated: !!token,
          isHydrated: true,
          isOnline: !!token // Set online status based on token
        });

        // Update online status in backend if token exists
        if (token) {
          await axios.patch('/api/auth/online-status', { isOnline: true }, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
      } catch (err) {
        console.error('Hydration error:', err);
        set({ isHydrated: true });
      }
    },

    setUser: (authData) => {
      if (!authData || typeof authData !== 'object') {
        console.error('Invalid auth data:', authData);
        return;
      }

      const { user, token } = authData;
      
      if (!user || !token) {
        console.error('Missing required fields in auth data');
        return;
      }

      try {
        localStorage.setItem('authUser', JSON.stringify(user));
        localStorage.setItem('token', token);
        set({
          user,
          token,
          isAuthenticated: true,
          isHydrated: true,
          isOnline: true // Set online status
        });

        // Update online status in backend
        axios.patch('/api/auth/online-status', { isOnline: true }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Error setting user:', err);
      }
    },

    clearUser: () => {
      const token = get().token;
      localStorage.removeItem('authUser');
      localStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isHydrated: true,
        isOnline: false // Set offline status
      });

      // Update online status in backend if token exists
      if (token) {
        axios.patch('/api/auth/online-status', { isOnline: false }, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(err => console.error('Error updating online status:', err));
      }
    }
  };
});

export default useAuthStore;