// Definición del tipo User
export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Roles de usuario
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
}

// DTO para crear usuario
export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

// DTO para actualizar usuario
export interface UpdateUserDto {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: UserRole;
  isActive?: boolean;
}

// Respuesta de autenticación
export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}
