package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.TeamColor;
import co.edu.uniquindio.rosteredge.backend.service.TeamColorService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/team-colors")
@Slf4j
public class TeamColorController extends SimpleCrudController<TeamColor> {

    private final TeamColorService teamColorService;

    public TeamColorController(TeamColorService service) {
        super(service);
        this.teamColorService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<TeamColor>>> findAll() {
        HttpServletRequest request = currentRequest();
        
        Long teamId = parseLong(request.getParameter("teamId"));
        Long colorId = parseLong(request.getParameter("colorId"));
        Boolean active = resolveActive(parseBoolean(request.getParameter("active")));

        log.info("Request to get team colors with filters - teamId: {}, colorId: {}, active: {}",
                teamId, colorId, active);

        List<TeamColor> teamColors = teamColorService.findByFilters(teamId, colorId, active);
        return ResponseEntity.ok(ApiResponse.success(teamColors));
    }
}

