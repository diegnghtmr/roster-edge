package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.Plan;
import co.edu.uniquindio.rosteredge.backend.service.PlanService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/plans")
@Slf4j
public class PlanController extends SimpleCrudController<Plan> {

    private final PlanService planService;

    public PlanController(PlanService service) {
        super(service);
        this.planService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<Plan>>> findAll() {
        HttpServletRequest request = currentRequest();
        String name = trimToNull(request.getParameter("name"));
        Boolean active = resolveActive(parseBoolean(request.getParameter("active")));
        BigDecimal priceFrom = parseBigDecimal(request.getParameter("priceFrom"));
        BigDecimal priceTo = parseBigDecimal(request.getParameter("priceTo"));

        log.info("Request to get plans with filters - name: {}, active: {}, priceFrom: {}, priceTo: {}",
                name, active, priceFrom, priceTo);

        List<Plan> plans = planService.findByFilters(name, active, priceFrom, priceTo);
        return ResponseEntity.ok(ApiResponse.success(plans));
    }
}

