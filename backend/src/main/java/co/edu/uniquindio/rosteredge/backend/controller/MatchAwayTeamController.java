package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.MatchAwayTeam;
import co.edu.uniquindio.rosteredge.backend.service.MatchAwayTeamService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/match-away-teams")
@Slf4j
public class MatchAwayTeamController extends SimpleCrudController<MatchAwayTeam> {

    private final MatchAwayTeamService matchAwayTeamService;

    public MatchAwayTeamController(MatchAwayTeamService service) {
        super(service);
        this.matchAwayTeamService = service;
    }

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchAwayTeam>>> findAll() {
        HttpServletRequest request = currentRequest();
        Long matchId = parseLong(request.getParameter("matchId"));
        Long teamId = parseLong(request.getParameter("teamId"));
        Boolean active = parseBoolean(request.getParameter("active"));

        log.info("Request to get match away teams with filters - matchId: {}, teamId: {}, active: {}",
                matchId, teamId, active);

        List<MatchAwayTeam> entries = matchAwayTeamService.findByFilters(matchId, teamId, active);
        return ResponseEntity.ok(ApiResponse.success(entries));
    }
}

