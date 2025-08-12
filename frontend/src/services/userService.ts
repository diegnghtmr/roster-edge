import { api } from './apiClient';
import type { User, CreateUserDto, UpdateUserDto, ApiResponse } from '../types/user';

export const userService = {
  // Get all users
  getAll: async () => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  },

  // Get user by ID
  getById: async (id: number) => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  // Register new user (corrected endpoint)
  register: async (userData: CreateUserDto) => {
    const response = await api.post<ApiResponse<User>>('/users/register', userData);
    return response.data.data;
  },

  // Update user
  update: async (id: number, userData: UpdateUserDto) => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data.data;
  },

  // Delete user
  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  },

  // User login (corrected endpoint and using username)
  login: async (username: string, password: string) => {
    const response = await api.post<ApiResponse<{ token: string; username: string }>>('/users/login', {
      username,
      password,
    });
    // Return token and fetch user profile separately
    return {
      token: response.data.data.token,
      username: response.data.data.username
    };
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>('/users/profile');
    return response.data.data;
  },

  // User logout (corrected endpoint)
  logout: async () => {
    const response = await api.post<ApiResponse<void>>('/users/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  },
};
