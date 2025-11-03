package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.MatchHomeTeam;
import co.edu.uniquindio.rosteredge.backend.service.MatchHomeTeamService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/match-home-teams")
@Slf4j
public class MatchHomeTeamController extends SimpleCrudController<MatchHomeTeam> {

    private final MatchHomeTeamService matchHomeTeamService;

    public MatchHomeTeamController(MatchHomeTeamService service) {
        super(service);
        this.matchHomeTeamService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<MatchHomeTeam>>> findAll() {
        HttpServletRequest request = currentRequest();
        Long matchId = parseLong(request.getParameter("matchId"));
        Long teamId = parseLong(request.getParameter("teamId"));
        Boolean active = resolveActive(parseBoolean(request.getParameter("active")));

        log.info("Request to get match home teams with filters - matchId: {}, teamId: {}, active: {}",
                matchId, teamId, active);

        List<MatchHomeTeam> entries = matchHomeTeamService.findByFilters(matchId, teamId, active);
        return ResponseEntity.ok(ApiResponse.success(entries));
    }
}

