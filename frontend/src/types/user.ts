// User entity type matching backend UserDTO
export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: 'ADMIN' | 'COACH' | 'PLAYER' | 'VIEWER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// DTO for creating a new user (registration)
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  role?: 'ADMIN' | 'COACH' | 'PLAYER' | 'VIEWER';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

// DTO for updating user information
export interface UpdateUserDto {
  email?: string;
  fullName?: string;
  password?: string;
  role?: 'ADMIN' | 'COACH' | 'PLAYER' | 'VIEWER';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  active?: boolean;
}

// API Response wrapper matching backend ApiResponse
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errorCode?: string;
  timestamp: number;
}

// Login response type
export interface LoginResponse {
  token: string;
  username: string;
}

// Auth state type
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
