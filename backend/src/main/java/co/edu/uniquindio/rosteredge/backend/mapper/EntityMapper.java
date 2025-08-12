package co.edu.uniquindio.rosteredge.backend.mapper;

import co.edu.uniquindio.rosteredge.backend.dto.*;
import co.edu.uniquindio.rosteredge.backend.model.*;
import org.springframework.stereotype.Component;

/**
 * Manual mapper for converting between entities and DTOs
 */
@Component
public class EntityMapper {
    
    // User mappings
    public UserDTO toUserDTO(User entity) {
        if (entity == null) return null;
        
        return UserDTO.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .fullName(entity.getFullName())
                .role(entity.getRole())
                .status(entity.getStatus())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    public User toUserEntity(UserDTO dto) {
        if (dto == null) return null;
        
        return User.builder()
                .id(dto.getId())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .fullName(dto.getFullName())
                .role(dto.getRole())
                .status(dto.getStatus())
                .active(dto.getActive())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .build();
    }
    
    public void updateUserEntity(User entity, UserDTO dto) {
        if (entity == null || dto == null) return;
        
        if (dto.getUsername() != null) entity.setUsername(dto.getUsername());
        if (dto.getEmail() != null) entity.setEmail(dto.getEmail());
        if (dto.getPassword() != null) entity.setPassword(dto.getPassword());
        if (dto.getFullName() != null) entity.setFullName(dto.getFullName());
        if (dto.getRole() != null) entity.setRole(dto.getRole());
        if (dto.getStatus() != null) entity.setStatus(dto.getStatus());
        if (dto.getActive() != null) entity.setActive(dto.getActive());
    }
    
    // Team mappings
    public TeamDTO toTeamDTO(Team entity) {
        if (entity == null) return null;
        
        return TeamDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .sport(entity.getSport())
                .description(entity.getDescription())
                .foundedYear(entity.getFoundedYear())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    public Team toTeamEntity(TeamDTO dto) {
        if (dto == null) return null;
        
        return Team.builder()
                .id(dto.getId())
                .name(dto.getName())
                .sport(dto.getSport())
                .description(dto.getDescription())
                .foundedYear(dto.getFoundedYear())
                .active(dto.getActive())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .build();
    }
    
    public void updateTeamEntity(Team entity, TeamDTO dto) {
        if (entity == null || dto == null) return;
        
        if (dto.getName() != null) entity.setName(dto.getName());
        if (dto.getSport() != null) entity.setSport(dto.getSport());
        if (dto.getDescription() != null) entity.setDescription(dto.getDescription());
        if (dto.getFoundedYear() != null) entity.setFoundedYear(dto.getFoundedYear());
        if (dto.getActive() != null) entity.setActive(dto.getActive());
    }
    
    // Player mappings
    public PlayerDTO toPlayerDTO(Player entity) {
        if (entity == null) return null;
        
        return PlayerDTO.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .jerseyNumber(entity.getJerseyNumber())
                .position(entity.getPosition())
                .dateOfBirth(entity.getDateOfBirth())
                .nationality(entity.getNationality())
                .teamId(entity.getTeamId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    public Player toPlayerEntity(PlayerDTO dto) {
        if (dto == null) return null;
        
        return Player.builder()
                .id(dto.getId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .jerseyNumber(dto.getJerseyNumber())
                .position(dto.getPosition())
                .dateOfBirth(dto.getDateOfBirth())
                .nationality(dto.getNationality())
                .teamId(dto.getTeamId())
                .active(dto.getActive())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .build();
    }
    
    public void updatePlayerEntity(Player entity, PlayerDTO dto) {
        if (entity == null || dto == null) return;
        
        if (dto.getFirstName() != null) entity.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) entity.setLastName(dto.getLastName());
        if (dto.getJerseyNumber() != null) entity.setJerseyNumber(dto.getJerseyNumber());
        if (dto.getPosition() != null) entity.setPosition(dto.getPosition());
        if (dto.getDateOfBirth() != null) entity.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getNationality() != null) entity.setNationality(dto.getNationality());
        if (dto.getTeamId() != null) entity.setTeamId(dto.getTeamId());
        if (dto.getActive() != null) entity.setActive(dto.getActive());
    }
    
    // Match mappings
    public MatchDTO toMatchDTO(Match entity) {
        if (entity == null) return null;
        
        return MatchDTO.builder()
                .id(entity.getId())
                .homeTeamId(entity.getHomeTeamId())
                .awayTeamId(entity.getAwayTeamId())
                .matchDate(entity.getMatchDate())
                .homeScore(entity.getHomeScore())
                .awayScore(entity.getAwayScore())
                .status(entity.getStatus())
                .venue(entity.getVenue())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    public Match toMatchEntity(MatchDTO dto) {
        if (dto == null) return null;
        
        return Match.builder()
                .id(dto.getId())
                .homeTeamId(dto.getHomeTeamId())
                .awayTeamId(dto.getAwayTeamId())
                .matchDate(dto.getMatchDate())
                .homeScore(dto.getHomeScore())
                .awayScore(dto.getAwayScore())
                .status(dto.getStatus())
                .venue(dto.getVenue())
                .active(dto.getActive())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .build();
    }
    
    public void updateMatchEntity(Match entity, MatchDTO dto) {
        if (entity == null || dto == null) return;
        
        if (dto.getHomeTeamId() != null) entity.setHomeTeamId(dto.getHomeTeamId());
        if (dto.getAwayTeamId() != null) entity.setAwayTeamId(dto.getAwayTeamId());
        if (dto.getMatchDate() != null) entity.setMatchDate(dto.getMatchDate());
        if (dto.getHomeScore() != null) entity.setHomeScore(dto.getHomeScore());
        if (dto.getAwayScore() != null) entity.setAwayScore(dto.getAwayScore());
        if (dto.getStatus() != null) entity.setStatus(dto.getStatus());
        if (dto.getVenue() != null) entity.setVenue(dto.getVenue());
        if (dto.getActive() != null) entity.setActive(dto.getActive());
    }
}
