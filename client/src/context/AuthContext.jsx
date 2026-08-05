import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // In a real application, you might want a /api/auth/me endpoint to check session on load.
  // For now, we will assume if we have local storage user data, they are logged in,
  // but true validation happens via HTTP Only Cookie on the backend.
  useEffect(() => {
    const storedUser = localStorage.getItem('nexus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('nexus_user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await api.post('/v1/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('nexus_user');
    }
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
