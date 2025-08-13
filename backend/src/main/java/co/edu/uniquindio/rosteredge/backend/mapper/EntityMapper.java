package co.edu.uniquindio.rosteredge.backend.mapper;

import co.edu.uniquindio.rosteredge.backend.dto.*;
import co.edu.uniquindio.rosteredge.backend.dto.request.*;
import co.edu.uniquindio.rosteredge.backend.dto.response.*;
import co.edu.uniquindio.rosteredge.backend.model.*;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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
    
    // Player Request/Response mappings
    public PlayerResponse toPlayerResponse(Player entity) {
        if (entity == null) return null;
        
        PlayerResponse response = PlayerResponse.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .fullName(entity.getFirstName() + " " + entity.getLastName())
                .teamId(entity.getTeamId())
                .position(entity.getPosition())
                .jerseyNumber(entity.getJerseyNumber())
                .active(entity.getActive())
                .dateOfBirth(entity.getDateOfBirth())
                .nationality(entity.getNationality())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
        
        // Calculate age if date of birth is present
        if (entity.getDateOfBirth() != null) {
            response.setAge(Period.between(entity.getDateOfBirth(), LocalDate.now()).getYears());
        }
        
        return response;
    }
    
    public PlayerResponse toPlayerResponse(Player entity, Team team) {
        if (entity == null) return null;
        
        PlayerResponse response = toPlayerResponse(entity);
        
        if (team != null) {
            response.setTeamName(team.getName());
            response.setTeam(PlayerResponse.TeamSummary.builder()
                    .id(team.getId())
                    .name(team.getName())
                    .sport(team.getSport())
                    .build());
        }
        
        return response;
    }
    
    public Player toPlayerEntity(PlayerRequest request) {
        if (request == null) return null;
        
        return Player.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .teamId(request.getTeamId())
                .position(request.getPosition())
                .jerseyNumber(request.getJerseyNumber())
                .active(request.getActive())
                .dateOfBirth(request.getDateOfBirth())
                .nationality(request.getNationality())
                .build();
    }
    
    public void updatePlayerEntity(Player entity, PlayerRequest request) {
        if (entity == null || request == null) return;
        
        entity.setFirstName(request.getFirstName());
        entity.setLastName(request.getLastName());
        entity.setTeamId(request.getTeamId());
        entity.setPosition(request.getPosition());
        entity.setJerseyNumber(request.getJerseyNumber());
        entity.setActive(request.getActive());
        entity.setDateOfBirth(request.getDateOfBirth());
        entity.setNationality(request.getNationality());
    }
    
    // Player list conversions for bulk mapping
    public List<PlayerResponse> toPlayerResponseList(List<Player> entities) {
        if (entities == null || entities.isEmpty()) {
            return Collections.emptyList();
        }
        return entities.stream()
                .map(this::toPlayerResponse)
                .collect(Collectors.toList());
    }
    
    public List<Player> toPlayerEntityList(List<PlayerRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return Collections.emptyList();
        }
        return requests.stream()
                .map(this::toPlayerEntity)
                .collect(Collectors.toList());
    }
    
    public List<PlayerDTO> toPlayerDTOList(List<Player> entities) {
        if (entities == null || entities.isEmpty()) {
            return Collections.emptyList();
        }
        return entities.stream()
                .map(this::toPlayerDTO)
                .collect(Collectors.toList());
    }
    
    public List<Player> playerDTOListToEntityList(List<PlayerDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            return Collections.emptyList();
        }
        return dtos.stream()
                .map(this::toPlayerEntity)
                .collect(Collectors.toList());
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
    
    // Match Request/Response mappings
    public MatchResponse toMatchResponse(Match entity) {
        if (entity == null) return null;
        
        MatchResponse response = MatchResponse.builder()
                .id(entity.getId())
                .homeTeamId(entity.getHomeTeamId())
                .awayTeamId(entity.getAwayTeamId())
                .matchDate(entity.getMatchDate())
                .venue(entity.getVenue())
                .status(entity.getStatus())
                .homeScore(entity.getHomeScore())
                .awayScore(entity.getAwayScore())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive())
                .build();
        
        // Set score display if scores are available
        if (entity.getHomeScore() != null && entity.getAwayScore() != null) {
            response.setScoreDisplay(entity.getHomeScore() + " - " + entity.getAwayScore());
        }
        
        // Set match result if completed
        if ("COMPLETED".equals(entity.getStatus()) && entity.getHomeScore() != null && entity.getAwayScore() != null) {
            MatchResponse.MatchResult result = MatchResponse.MatchResult.builder()
                    .isCompleted(true)
                    .goalDifference(Math.abs(entity.getHomeScore() - entity.getAwayScore()))
                    .build();
            
            if (entity.getHomeScore() > entity.getAwayScore()) {
                result.setWinner("HOME");
            } else if (entity.getAwayScore() > entity.getHomeScore()) {
                result.setWinner("AWAY");
            } else {
                result.setWinner("DRAW");
            }
            
            response.setResult(result);
        }
        
        return response;
    }
    
    public MatchResponse toMatchResponse(Match entity, Team homeTeam, Team awayTeam) {
        if (entity == null) return null;
        
        MatchResponse response = toMatchResponse(entity);
        
        if (homeTeam != null) {
            response.setHomeTeamName(homeTeam.getName());
            response.setHomeTeam(MatchResponse.TeamSummary.builder()
                    .id(homeTeam.getId())
                    .name(homeTeam.getName())
                    .sport(homeTeam.getSport())
                    .build());
        }
        
        if (awayTeam != null) {
            response.setAwayTeamName(awayTeam.getName());
            response.setAwayTeam(MatchResponse.TeamSummary.builder()
                    .id(awayTeam.getId())
                    .name(awayTeam.getName())
                    .sport(awayTeam.getSport())
                    .build());
        }
        
        return response;
    }
    
    public Match toMatchEntity(MatchRequest request) {
        if (request == null) return null;
        
        return Match.builder()
                .homeTeamId(request.getHomeTeamId())
                .awayTeamId(request.getAwayTeamId())
        .matchDate(request.getMatchDate())
                .venue(request.getVenue())
                .status(request.getStatus() != null ? request.getStatus() : "SCHEDULED")
        .homeScore(request.getHomeScore())
        .awayScore(request.getAwayScore())
                .build();
    }
    
    public void updateMatchEntity(Match entity, MatchRequest request) {
        if (entity == null || request == null) return;
        
        entity.setHomeTeamId(request.getHomeTeamId());
        entity.setAwayTeamId(request.getAwayTeamId());
    entity.setMatchDate(request.getMatchDate());
        entity.setVenue(request.getVenue());
        if (request.getStatus() != null) entity.setStatus(request.getStatus());
    if (request.getHomeScore() != null) entity.setHomeScore(request.getHomeScore());
    if (request.getAwayScore() != null) entity.setAwayScore(request.getAwayScore());
    }
    
    // Match list conversions for bulk mapping
    public List<MatchResponse> toMatchResponseList(List<Match> entities) {
        if (entities == null || entities.isEmpty()) {
            return Collections.emptyList();
        }
        return entities.stream()
                .map(this::toMatchResponse)
                .collect(Collectors.toList());
    }
    
    public List<Match> toMatchEntityList(List<MatchRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return Collections.emptyList();
        }
        return requests.stream()
                .map(this::toMatchEntity)
                .collect(Collectors.toList());
    }
    
    public List<MatchDTO> toMatchDTOList(List<Match> entities) {
        if (entities == null || entities.isEmpty()) {
            return Collections.emptyList();
        }
        return entities.stream()
                .map(this::toMatchDTO)
                .collect(Collectors.toList());
    }
    
    public List<Match> matchDTOListToEntityList(List<MatchDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            return Collections.emptyList();
        }
        return dtos.stream()
                .map(this::toMatchEntity)
                .collect(Collectors.toList());
    }
}
