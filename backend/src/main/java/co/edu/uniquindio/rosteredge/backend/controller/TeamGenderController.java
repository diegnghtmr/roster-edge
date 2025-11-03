package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.TeamGender;
import co.edu.uniquindio.rosteredge.backend.service.TeamGenderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/team-genders")
@Slf4j
public class TeamGenderController extends SimpleCrudController<TeamGender> {

    private final TeamGenderService teamGenderService;

    public TeamGenderController(TeamGenderService service) {
        super(service);
        this.teamGenderService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<TeamGender>>> findAll() {
        HttpServletRequest request = currentRequest();
        
        String name = trimToNull(request.getParameter("name"));
        Boolean active = resolveActive(parseBoolean(request.getParameter("active")));

        log.info("Request to get team genders with filters - name: {}, active: {}", name, active);

        List<TeamGender> teamGenders = teamGenderService.findByFilters(name, active);
        return ResponseEntity.ok(ApiResponse.success(teamGenders));
    }
}

