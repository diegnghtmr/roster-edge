package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.ClubEvent;
import co.edu.uniquindio.rosteredge.backend.service.ClubEventService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/club-events")
@Slf4j
public class ClubEventController extends SimpleCrudController<ClubEvent> {

    private final ClubEventService clubEventService;

    public ClubEventController(ClubEventService service) {
        super(service);
        this.clubEventService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<ClubEvent>>> findAll() {
        HttpServletRequest request = currentRequest();
        Long clubId = parseLong(request.getParameter("clubId"));
        Long eventId = parseLong(request.getParameter("eventId"));
        Boolean active = resolveActive(parseBoolean(request.getParameter("active")));

        log.info("Request to get club events with filters - clubId: {}, eventId: {}, active: {}",
                clubId, eventId, active);

        List<ClubEvent> clubEvents = clubEventService.findByFilters(clubId, eventId, active);
        return ResponseEntity.ok(ApiResponse.success(clubEvents));
    }
}

