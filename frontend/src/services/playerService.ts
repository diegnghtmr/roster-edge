import { api } from './apiClient';
import type { ApiResponse } from '../types/user';

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  jerseyNumber?: number;
  position?: string;
  dateOfBirth?: string;
  nationality?: string;
  teamId?: number;
  teamName?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePlayerDto {
  firstName: string;
  lastName: string;
  jerseyNumber?: number;
  position?: string;
  dateOfBirth?: string;
  nationality?: string;
  teamId?: number;
}

export interface UpdatePlayerDto {
  firstName?: string;
  lastName?: string;
  jerseyNumber?: number;
  position?: string;
  dateOfBirth?: string;
  nationality?: string;
  teamId?: number;
  active?: boolean;
}

export const playerService = {
  // Get all players
  getAll: async () => {
    const response = await api.get<ApiResponse<Player[]>>('/players');
    return response.data.data;
  },

  // Get player by ID
  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Player>>(`/players/${id}`);
    return response.data.data;
  },

  // Get players by team
  getByTeam: async (teamId: number) => {
    const response = await api.get<ApiResponse<Player[]>>(`/players/team/${teamId}`);
    return response.data.data;
  },

  // Get players by position
  getByPosition: async (position: string) => {
    const response = await api.get<ApiResponse<Player[]>>(`/players/position/${position}`);
    return response.data.data;
  },

  // Create new player (requires auth)
  create: async (playerData: CreatePlayerDto) => {
    const response = await api.post<ApiResponse<Player>>('/players', playerData);
    return response.data.data;
  },

  // Update player (requires auth)
  update: async (id: number, playerData: UpdatePlayerDto) => {
    const response = await api.put<ApiResponse<Player>>(`/players/${id}`, playerData);
    return response.data.data;
  },

  // Delete player (requires auth)
  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/players/${id}`);
    return response.data;
  },
};
