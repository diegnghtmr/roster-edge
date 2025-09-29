package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.Matchday;
import co.edu.uniquindio.rosteredge.backend.service.MatchdayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/matchdays")
@Slf4j
public class MatchdayController extends SimpleCrudController<Matchday> {

    private final MatchdayService matchdayService;

    public MatchdayController(MatchdayService service) {
        super(service);
        this.matchdayService = service;
    }

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<Matchday>>> findAll() {
        HttpServletRequest request = currentRequest();
        String name = trimToNull(request.getParameter("name"));
        Boolean active = parseBoolean(request.getParameter("active"));

        log.info("Request to get matchdays with filters - name: {}, active: {}", name, active);

        List<Matchday> matchdays = matchdayService.findByFilters(name, active);
        return ResponseEntity.ok(ApiResponse.success(matchdays));
    }
}

