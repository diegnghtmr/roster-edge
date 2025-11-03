package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.TeamDTO;
import co.edu.uniquindio.rosteredge.backend.dto.filter.TeamInsightsFilter;
import co.edu.uniquindio.rosteredge.backend.dto.response.TeamInsightsResponse;
import co.edu.uniquindio.rosteredge.backend.service.TeamService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teams")
@RequiredArgsConstructor
@Slf4j
public class TeamController extends BaseController {

    private final TeamService teamService;

    @PostMapping("/")
    public ResponseEntity<ApiResponse<TeamDTO>> createTeam(@Valid @RequestBody TeamDTO teamDTO) {
        log.info("Request to create team: {}", teamDTO.getName());
        TeamDTO createdTeam = teamService.createTeam(teamDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdTeam, "Team created successfully"));
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<TeamDTO>>> getAllTeams(
            @RequestParam(required = false) Long clubId,
            @RequestParam(required = false) Long genderId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean active) {
        Boolean effectiveActive = resolveActive(active);
        log.info("Request to get teams with filters - clubId: {}, genderId: {}, categoryId: {}, active: {}",
                clubId, genderId, categoryId, effectiveActive);
        List<TeamDTO> teams = teamService.findAllTeams(clubId, genderId, categoryId, effectiveActive);
        return ResponseEntity.ok(ApiResponse.success(teams));
    }

    @GetMapping("/insights/")
    public ResponseEntity<ApiResponse<List<TeamInsightsResponse>>> getTeamInsights(@ModelAttribute TeamInsightsFilter filter) {
        log.info("Request to get team insights with filter: {}", filter);
        List<TeamInsightsResponse> insights = teamService.findTeamInsights(filter);
        return ResponseEntity.ok(ApiResponse.success(insights));
    }

    @GetMapping("/{id}/")
    public ResponseEntity<ApiResponse<TeamDTO>> getTeamById(@PathVariable Long id) {
        log.info("Request to get team by id: {}", id);
        TeamDTO team = teamService.findTeamById(id);
        return ResponseEntity.ok(ApiResponse.success(team));
    }

    @PutMapping("/{id}/")
    public ResponseEntity<ApiResponse<TeamDTO>> updateTeam(@PathVariable Long id, @Valid @RequestBody TeamDTO teamDTO) {
        log.info("Request to update team with id: {}", id);
        TeamDTO updatedTeam = teamService.updateTeam(id, teamDTO);
        return ResponseEntity.ok(ApiResponse.success(updatedTeam, "Team updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTeam(@PathVariable Long id) {
        log.info("Request to delete team with id: {}", id);
        teamService.deleteTeam(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Team deleted successfully"));
    }
}
