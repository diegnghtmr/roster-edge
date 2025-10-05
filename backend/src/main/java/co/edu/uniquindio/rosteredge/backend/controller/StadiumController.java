package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.Stadium;
import co.edu.uniquindio.rosteredge.backend.service.StadiumService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/stadiums")
@Slf4j
public class StadiumController extends SimpleCrudController<Stadium> {

    private final StadiumService stadiumService;

    public StadiumController(StadiumService service) {
        super(service);
        this.stadiumService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<Stadium>>> findAll() {
        HttpServletRequest request = currentRequest();

        Long venueId = parseLong(request.getParameter("venueId"));
        String surface = trimToNull(request.getParameter("surface"));
        Boolean active = parseBoolean(request.getParameter("active"));
        Integer capacityFrom = parseInteger(request.getParameter("capacityFrom"));
        Integer capacityTo = parseInteger(request.getParameter("capacityTo"));
        LocalDate foundationFrom = parseDate(request.getParameter("foundationFrom"));
        LocalDate foundationTo = parseDate(request.getParameter("foundationTo"));
        BigDecimal areaFrom = parseBigDecimal(request.getParameter("areaFrom"));
        BigDecimal areaTo = parseBigDecimal(request.getParameter("areaTo"));

        log.info("Request to get stadiums with filters - venueId: {}, surface: {}, active: {}, capacityFrom: {}, capacityTo: {}, foundationFrom: {}, foundationTo: {}, areaFrom: {}, areaTo: {}",
                venueId, surface, active, capacityFrom, capacityTo, foundationFrom, foundationTo, areaFrom, areaTo);

        List<Stadium> stadiums = stadiumService.findByFilters(venueId, surface, active, capacityFrom, capacityTo,
                foundationFrom, foundationTo, areaFrom, areaTo);
        return ResponseEntity.ok(ApiResponse.success(stadiums));
    }

}
