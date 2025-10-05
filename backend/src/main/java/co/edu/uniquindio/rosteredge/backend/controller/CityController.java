package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.City;
import co.edu.uniquindio.rosteredge.backend.service.CityService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/cities")
@Slf4j
public class CityController extends SimpleCrudController<City> {

    private final CityService cityService;

    public CityController(CityService service) {
        super(service);
        this.cityService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<City>>> findAll() {
        HttpServletRequest request = currentRequest();
        Long countryId = parseLong(request.getParameter("countryId"));
        String name = trimToNull(request.getParameter("name"));
        Boolean active = parseBoolean(request.getParameter("active"));

        log.info("Request to get cities with filters - countryId: {}, name: {}, active: {}",
                countryId, name, active);

        List<City> cities = cityService.findByFilters(countryId, name, active);
        return ResponseEntity.ok(ApiResponse.success(cities));
    }
}

