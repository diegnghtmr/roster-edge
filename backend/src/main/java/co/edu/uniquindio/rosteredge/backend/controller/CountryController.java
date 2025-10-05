package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.Country;
import co.edu.uniquindio.rosteredge.backend.service.CountryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/countries")
@Slf4j
public class CountryController extends SimpleCrudController<Country> {

    private final CountryService countryService;

    public CountryController(CountryService service) {
        super(service);
        this.countryService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<Country>>> findAll() {
        HttpServletRequest request = currentRequest();
        String name = trimToNull(request.getParameter("name"));
        Boolean active = parseBoolean(request.getParameter("active"));

        log.info("Request to get countries with filters - name: {}, active: {}", name, active);

        List<Country> countries = countryService.findByFilters(name, active);
        return ResponseEntity.ok(ApiResponse.success(countries));
    }
}

