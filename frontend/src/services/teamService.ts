import { api } from './apiClient';
import type { ApiResponse } from '../types/user';

export interface Team {
  id: number;
  name: string;
  sport?: string;
  description?: string;
  foundedYear?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTeamDto {
  name: string;
  sport?: string;
  description?: string;
  foundedYear?: number;
}

export interface UpdateTeamDto {
  name?: string;
  sport?: string;
  description?: string;
  foundedYear?: number;
  active?: boolean;
}

export const teamService = {
  // Get all teams
  getAll: async () => {
    const response = await api.get<ApiResponse<Team[]>>('/teams');
    return response.data.data;
  },

  // Get team by ID
  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Team>>(`/teams/${id}`);
    return response.data.data;
  },

  // Get active teams
  getActive: async () => {
    const response = await api.get<ApiResponse<Team[]>>('/teams/active');
    return response.data.data;
  },

  // Get teams by sport
  getBySport: async (sport: string) => {
    const response = await api.get<ApiResponse<Team[]>>(`/teams/sport/${sport}`);
    return response.data.data;
  },

  // Create new team (requires auth)
  create: async (teamData: CreateTeamDto) => {
    const response = await api.post<ApiResponse<Team>>('/teams', teamData);
    return response.data.data;
  },

  // Update team (requires auth)
  update: async (id: number, teamData: UpdateTeamDto) => {
    const response = await api.put<ApiResponse<Team>>(`/teams/${id}`, teamData);
    return response.data.data;
  },

  // Delete team (requires auth)
  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/teams/${id}`);
    return response.data;
  },
};
