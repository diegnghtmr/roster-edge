import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User } from '../types/user';
import { userService } from '../services/userService';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate token on mount by fetching user profile
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          // Set token for API calls
          setToken(storedToken);
          
          // Fetch user profile to validate token
          const userProfile = await userService.getProfile();
          setUser(userProfile);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userProfile));
        } catch (err) {
          console.error('Token validation failed:', err);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    
    validateToken();
  }, []);

  const login = useCallback(async (usernameOrEmail: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      // Backend expects username, but we allow email input
      // Check if it's an email and use it as username for now
      const isEmail = usernameOrEmail.includes('@');
      const username = isEmail ? usernameOrEmail.split('@')[0] : usernameOrEmail;
      
      // Login and get token
      const loginResponse = await userService.login(username, password);
      const { token: authToken } = loginResponse;
      
      // Store token
      localStorage.setItem('token', authToken);
      setToken(authToken);
      
      // Fetch user profile after successful login
      const userProfile = await userService.getProfile();
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(userProfile));
      setUser(userProfile);
      setIsAuthenticated(true);
      
    } catch (err) {
      const error = err as Error & {response?: {data?: {message?: string}}};
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint if token exists
      if (token) {
        await userService.logout();
      }
    } catch (err) {
      // Even if logout fails, clear local data
      console.error('Logout error:', err);
    } finally {
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  }, [token]);

  const contextValue = useMemo(() => ({
    isAuthenticated,
    user,
    token,
    login,
    logout,
    loading,
    error,
  }), [isAuthenticated, user, token, login, logout, loading, error]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
