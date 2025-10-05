package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.Currency;
import co.edu.uniquindio.rosteredge.backend.service.CurrencyService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/currencies")
@Slf4j
public class CurrencyController extends SimpleCrudController<Currency> {

    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService service) {
        super(service);
        this.currencyService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<Currency>>> findAll() {
        HttpServletRequest request = currentRequest();
        String name = trimToNull(request.getParameter("name"));
        String symbol = trimToNull(request.getParameter("symbol"));
        Boolean active = parseBoolean(request.getParameter("active"));

        log.info("Request to get currencies with filters - name: {}, symbol: {}, active: {}",
                name, symbol, active);

        List<Currency> currencies = currencyService.findByFilters(name, symbol, active);
        return ResponseEntity.ok(ApiResponse.success(currencies));
    }
}

