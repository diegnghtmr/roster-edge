package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.PlanBenefit;
import co.edu.uniquindio.rosteredge.backend.service.PlanBenefitService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/plan-benefits")
@Slf4j
public class PlanBenefitController extends SimpleCrudController<PlanBenefit> {

    private final PlanBenefitService planBenefitService;

    public PlanBenefitController(PlanBenefitService service) {
        super(service);
        this.planBenefitService = service;
    }

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<PlanBenefit>>> findAll() {
        HttpServletRequest request = currentRequest();
        
        Long planId = parseLong(request.getParameter("planId"));
        String description = trimToNull(request.getParameter("description"));
        Boolean active = parseBoolean(request.getParameter("active"));

        log.info("Request to get plan benefits with filters - planId: {}, description: {}, active: {}",
                planId, description, active);

        List<PlanBenefit> planBenefits = planBenefitService.findByFilters(planId, description, active);
        return ResponseEntity.ok(ApiResponse.success(planBenefits));
    }
}

