package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.TeamDTO;
import co.edu.uniquindio.rosteredge.backend.exception.UnauthorizedException;
import co.edu.uniquindio.rosteredge.backend.mapper.EntityMapper;
import co.edu.uniquindio.rosteredge.backend.model.Team;
import co.edu.uniquindio.rosteredge.backend.model.User;
import co.edu.uniquindio.rosteredge.backend.service.TeamService;
import co.edu.uniquindio.rosteredge.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/teams")
@RequiredArgsConstructor
@Slf4j
public class TeamController extends BaseController {
    
    private final TeamService teamService;
    private final UserService userService;
    private final EntityMapper mapper;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<TeamDTO>>> getAllTeams() {
        log.debug("Getting all teams");
        List<Team> teams = teamService.findAll();
        List<TeamDTO> teamDTOs = teams.stream()
                .map(mapper::toTeamDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(teamDTOs));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TeamDTO>> getTeamById(@PathVariable Long id) {
        log.debug("Getting team by id: {}", id);
        Team team = teamService.findById(id)
                .orElseThrow(() -> new co.edu.uniquindio.rosteredge.backend.exception.EntityNotFoundException("Team", id));
        TeamDTO teamDTO = mapper.toTeamDTO(team);
        return ResponseEntity.ok(ApiResponse.success(teamDTO));
    }
    
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<TeamDTO>>> getActiveTeams() {
        log.debug("Getting all active teams");
        List<Team> teams = teamService.findActiveTeams();
        List<TeamDTO> teamDTOs = teams.stream()
                .map(mapper::toTeamDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(teamDTOs));
    }
    
    @GetMapping("/sport/{sport}")
    public ResponseEntity<ApiResponse<List<TeamDTO>>> getTeamsBySport(@PathVariable String sport) {
        log.debug("Getting teams by sport: {}", sport);
        List<Team> teams = teamService.findBySport(sport);
        List<TeamDTO> teamDTOs = teams.stream()
                .map(mapper::toTeamDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(teamDTOs));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<TeamDTO>> createTeam(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody TeamDTO teamDTO) {
        
        // Verify admin or coach authorization
        User user = userService.findByAuthToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid token"));
        
        if (!"ADMIN".equals(user.getRole()) && !"COACH".equals(user.getRole())) {
            throw new UnauthorizedException("Only admins and coaches can create teams");
        }
        
        log.info("Creating new team: {}", teamDTO.getName());
        Team team = mapper.toTeamEntity(teamDTO);
        Team savedTeam = teamService.save(team);
        TeamDTO responseDTO = mapper.toTeamDTO(savedTeam);
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(responseDTO, "Team created successfully"));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TeamDTO>> updateTeam(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody TeamDTO teamDTO) {
        
        // Verify admin or coach authorization
        User user = userService.findByAuthToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid token"));
        
        if (!"ADMIN".equals(user.getRole()) && !"COACH".equals(user.getRole())) {
            throw new UnauthorizedException("Only admins and coaches can update teams");
        }
        
        log.info("Updating team with id: {}", id);
        Team team = mapper.toTeamEntity(teamDTO);
        Team updatedTeam = teamService.update(id, team);
        TeamDTO responseDTO = mapper.toTeamDTO(updatedTeam);
        
        return ResponseEntity.ok(ApiResponse.success(responseDTO, "Team updated successfully"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTeam(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        
        // Verify admin authorization
        User user = userService.findByAuthToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid token"));
        
        if (!"ADMIN".equals(user.getRole())) {
            throw new UnauthorizedException("Only admins can delete teams");
        }
        
        log.info("Deleting team with id: {}", id);
        teamService.deleteById(id);
        
        return ResponseEntity.ok(ApiResponse.success(null, "Team deleted successfully"));
    }
}
