import { api } from './apiClient';
import type { ApiResponse } from '../types/user';

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName?: string;
  awayTeamName?: string;
  matchDate: string;
  homeScore?: number;
  awayScore?: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  venue?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMatchDto {
  homeTeamId: number;
  awayTeamId: number;
  matchDate: string;
  homeScore?: number;
  awayScore?: number;
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  venue?: string;
}

export interface UpdateMatchDto {
  homeTeamId?: number;
  awayTeamId?: number;
  matchDate?: string;
  homeScore?: number;
  awayScore?: number;
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  venue?: string;
  active?: boolean;
}

export const matchService = {
  // Get all matches
  getAll: async () => {
    const response = await api.get<ApiResponse<Match[]>>('/matches');
    return response.data.data;
  },

  // Get match by ID
  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Match>>(`/matches/${id}`);
    return response.data.data;
  },

  // Get matches by team
  getByTeam: async (teamId: number) => {
    const response = await api.get<ApiResponse<Match[]>>(`/matches/team/${teamId}`);
    return response.data.data;
  },

  // Get matches by status
  getByStatus: async (status: string) => {
    const response = await api.get<ApiResponse<Match[]>>(`/matches/status/${status}`);
    return response.data.data;
  },

  // Get matches by date range
  getByDateRange: async (startDate: string, endDate: string) => {
    const response = await api.get<ApiResponse<Match[]>>('/matches/date-range', {
      params: { startDate, endDate }
    });
    return response.data.data;
  },

  // Create new match (requires auth)
  create: async (matchData: CreateMatchDto) => {
    const response = await api.post<ApiResponse<Match>>('/matches', matchData);
    return response.data.data;
  },

  // Update match (requires auth)
  update: async (id: number, matchData: UpdateMatchDto) => {
    const response = await api.put<ApiResponse<Match>>(`/matches/${id}`, matchData);
    return response.data.data;
  },

  // Delete match (requires auth)
  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/matches/${id}`);
    return response.data;
  },
};
