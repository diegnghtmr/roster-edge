import { api } from './apiClient';
import { User, CreateUserDto, UpdateUserDto } from '../types/user';

export const userService = {
  // Obtener todos los usuarios
  getAll: async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  // Obtener usuario por ID
  getById: async (id: number) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  // Crear nuevo usuario
  create: async (userData: CreateUserDto) => {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },

  // Actualizar usuario
  update: async (id: number, userData: UpdateUserDto) => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  // Eliminar usuario
  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Login de usuario
  login: async (email: string, password: string) => {
    const response = await api.post<{ token: string; user: User }>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // Logout de usuario
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  },
};
