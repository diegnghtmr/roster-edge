package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.Streak;
import co.edu.uniquindio.rosteredge.backend.service.StreakService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/streaks")
@Slf4j
public class StreakController extends SimpleCrudController<Streak> {

    private final StreakService streakService;

    public StreakController(StreakService service) {
        super(service);
        this.streakService = service;
    }

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<Streak>>> findAll() {
        HttpServletRequest request = currentRequest();
        Long teamId = parseLong(request.getParameter("teamId"));
        Boolean active = parseBoolean(request.getParameter("active"));
        LocalDate startDateFrom = parseDate(request.getParameter("startDateFrom"));
        LocalDate startDateTo = parseDate(request.getParameter("startDateTo"));
        LocalDate endDateFrom = parseDate(request.getParameter("endDateFrom"));
        LocalDate endDateTo = parseDate(request.getParameter("endDateTo"));

        log.info("Request to get streaks with filters - teamId: {}, active: {}, startDateFrom: {}, startDateTo: {}, endDateFrom: {}, endDateTo: {}",
                teamId, active, startDateFrom, startDateTo, endDateFrom, endDateTo);

        List<Streak> streaks = streakService.findByFilters(teamId, active, startDateFrom, startDateTo, endDateFrom, endDateTo);
        return ResponseEntity.ok(ApiResponse.success(streaks));
    }
}

