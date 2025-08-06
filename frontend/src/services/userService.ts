import { api } from './apiClient';
import { User, CreateUserDto, UpdateUserDto } from '../types/user';

export const userService = {
  // Get all users
  getAll: async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  // Get user by ID
  getById: async (id: number) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  // Create new user
  create: async (userData: CreateUserDto) => {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },

  // Update user
  update: async (id: number, userData: UpdateUserDto) => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // User login
  login: async (email: string, password: string) => {
    const response = await api.post<{ token: string; user: User }>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // User logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  },
};
