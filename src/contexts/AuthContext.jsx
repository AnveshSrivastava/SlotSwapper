import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockLogin, mockSignup, mockLogout, getCurrentUser } from '../utils/mockData';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedToken = localStorage.getItem('SLOTSWAPPER_TOKEN');
    const storedUser = getCurrentUser();
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await mockLogin(email, password);
      setUser(result.user);
      setToken(result.token);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email, name, password) => {
    try {
      const result = await mockSignup(email, name, password);
      setUser(result.user);
      setToken(result.token);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    mockLogout();
    setUser(null);
    setToken(null);
  };

  const refreshUser = () => {
    const updatedUser = getCurrentUser();
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    refreshUser,
    isAuthenticated: !!user
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};