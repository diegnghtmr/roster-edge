// Export all services from a single entry point
export { userService } from './userService';
export { teamService } from './teamService';
export { playerService } from './playerService';
export { matchService } from './matchService';
export { api, default as apiClient } from './apiClient';

// Re-export types
export type { 
  Team, 
  CreateTeamDto, 
  UpdateTeamDto 
} from './teamService';

export type { 
  Player, 
  CreatePlayerDto, 
  UpdatePlayerDto 
} from './playerService';

export type { 
  Match, 
  CreateMatchDto, 
  UpdateMatchDto 
} from './matchService';
