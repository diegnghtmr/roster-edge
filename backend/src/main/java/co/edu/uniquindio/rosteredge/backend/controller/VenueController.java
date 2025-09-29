package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.Venue;
import co.edu.uniquindio.rosteredge.backend.service.VenueService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/venues")
@Slf4j
public class VenueController extends SimpleCrudController<Venue> {

    private final VenueService venueService;

    public VenueController(VenueService service) {
        super(service);
        this.venueService = service;
    }

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<Venue>>> findAll() {
        HttpServletRequest request = currentRequest();

        Long clubId = parseLong(request.getParameter("clubId"));
        Long cityId = parseLong(request.getParameter("cityId"));
        Boolean active = parseBoolean(request.getParameter("active"));
        String name = trimToNull(request.getParameter("name"));
        String email = trimToNull(request.getParameter("email"));
        LocalDate foundationFrom = parseDate(request.getParameter("foundationFrom"));
        LocalDate foundationTo = parseDate(request.getParameter("foundationTo"));

        log.info("Request to get venues with filters - clubId: {}, cityId: {}, active: {}, name: {}, email: {}, foundationFrom: {}, foundationTo: {}",
                clubId, cityId, active, name, email, foundationFrom, foundationTo);

        List<Venue> venues = venueService.findByFilters(clubId, cityId, active, name, email, foundationFrom, foundationTo);
        return ResponseEntity.ok(ApiResponse.success(venues));
    }

}
