package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.Roster;
import co.edu.uniquindio.rosteredge.backend.service.RosterService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/rosters")
@Slf4j
public class RosterCrudController extends SimpleCrudController<Roster> {

    private final RosterService rosterService;

    public RosterCrudController(RosterService service) {
        super(service);
        this.rosterService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<Roster>>> findAll() {
        HttpServletRequest request = currentRequest();
        Long clubId = parseLong(request.getParameter("clubId"));
        Long subscriptionId = parseLong(request.getParameter("subscriptionId"));
        Boolean active = resolveActive(parseBoolean(request.getParameter("active")));
        String name = trimToNull(request.getParameter("name"));
        String email = trimToNull(request.getParameter("email"));
        LocalDate creationFrom = parseDate(request.getParameter("creationFrom"));
        LocalDate creationTo = parseDate(request.getParameter("creationTo"));
        LocalDate lastAccessFrom = parseDate(request.getParameter("lastAccessFrom"));
        LocalDate lastAccessTo = parseDate(request.getParameter("lastAccessTo"));

        log.info("Request to get rosters with filters - clubId: {}, subscriptionId: {}, active: {}, name: {}, email: {}, creationFrom: {}, creationTo: {}, lastAccessFrom: {}, lastAccessTo: {}",
                clubId, subscriptionId, active, name, email, creationFrom, creationTo, lastAccessFrom, lastAccessTo);

        List<Roster> rosters = rosterService.findByFilters(clubId, subscriptionId, active,
                name, email, creationFrom, creationTo, lastAccessFrom, lastAccessTo);
        return ResponseEntity.ok(ApiResponse.success(rosters));
    }
}

