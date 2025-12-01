/**
 * Authentication Context for managing user state and auth operations
 * To connect to real APIs: Replace local storage with secure token management
 * and integrate with your authentication service (Firebase, Auth0, custom backend)
 */

'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('kanban_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('kanban_user');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Login function - TODO: Replace with real API call
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.login(email, password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email && password) {
        const userData = {
          id: 'user-' + Date.now(),
          email,
          name: email.split('@')[0],
          avatar: null,
          createdAt: new Date().toISOString()
        };
        
        setUser(userData);
        localStorage.setItem('kanban_user', JSON.stringify(userData));
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register function - TODO: Replace with real API call
   */
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.register(name, email, password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: 'user-' + Date.now(),
        email,
        name,
        avatar: null,
        createdAt: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('kanban_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Forgot password function - TODO: Replace with real API call
   */
  const forgotPassword = async (email) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.forgotPassword(email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('kanban_user');
  };

  /**
   * Update user profile - TODO: Replace with real API call
   */
  const updateProfile = async (updates) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.updateProfile(user.id, updates);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('kanban_user', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}