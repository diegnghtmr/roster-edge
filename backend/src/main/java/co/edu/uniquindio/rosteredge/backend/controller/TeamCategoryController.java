package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.TeamCategory;
import co.edu.uniquindio.rosteredge.backend.service.TeamCategoryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/team-categories")
@Slf4j
public class TeamCategoryController extends SimpleCrudController<TeamCategory> {

    private final TeamCategoryService teamCategoryService;

    public TeamCategoryController(TeamCategoryService service) {
        super(service);
        this.teamCategoryService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<TeamCategory>>> findAll() {
        HttpServletRequest request = currentRequest();

        String name = trimToNull(request.getParameter("name"));
        Boolean active = parseBoolean(request.getParameter("active"));

        log.info("Request to get team categories with filters - name: {}, active: {}", name, active);

        List<TeamCategory> categories = teamCategoryService.findByFilters(name, active);
        return ResponseEntity.ok(ApiResponse.success(categories));
    }
}

