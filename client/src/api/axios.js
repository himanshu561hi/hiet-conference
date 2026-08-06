import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true, // Crucial for sending/receiving HTTP Only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token from localStorage for cross-domain calls (Netlify -> Vercel)
api.interceptors.request.use(
  (config) => {
    try {
      const storedUser = localStorage.getItem('nexus_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.token) {
          config.headers.Authorization = `Bearer ${parsedUser.token}`;
        }
      }
    } catch (error) {
      console.error('Error attaching token in request interceptor:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
