import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User } from '../types/user';
import { userService } from '../services/userService';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
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

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error parsing stored user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const response = await userService.login(email, password);
      const { token: authToken, user: authUser } = response;
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(authUser));
      
      setToken(authToken);
      setUser(authUser);
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

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

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
