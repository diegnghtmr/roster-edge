package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.filter.SubscriptionCoverageFilter;
import co.edu.uniquindio.rosteredge.backend.dto.response.SubscriptionCoverageResponse;
import co.edu.uniquindio.rosteredge.backend.model.Subscription;
import co.edu.uniquindio.rosteredge.backend.service.SubscriptionService;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/subscriptions")
@Slf4j
public class SubscriptionController extends SimpleCrudController<Subscription> {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService service) {
        super(service);
        this.subscriptionService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<Subscription>>> findAll() {
        HttpServletRequest request = currentRequest();

        Long planId = parseLong(request.getParameter("planId"));
        Long statusId = parseLong(request.getParameter("statusId"));
        Boolean active = resolveActive(parseBoolean(request.getParameter("active")));
        LocalDate startDateFrom = parseDate(request.getParameter("startDateFrom"));
        LocalDate startDateTo = parseDate(request.getParameter("startDateTo"));
        LocalDate endDateFrom = parseDate(request.getParameter("endDateFrom"));
        LocalDate endDateTo = parseDate(request.getParameter("endDateTo"));

        log.info("Request to get subscriptions with filters - planId: {}, statusId: {}, active: {}, startDateFrom: {}, startDateTo: {}, endDateFrom: {}, endDateTo: {}",
                planId, statusId, active, startDateFrom, startDateTo, endDateFrom, endDateTo);

        List<Subscription> subscriptions = subscriptionService.findByFilters(planId, statusId, active,
                startDateFrom, startDateTo, endDateFrom, endDateTo);
        return ResponseEntity.ok(ApiResponse.success(subscriptions));
    }

    @GetMapping("/coverage/")
    public ResponseEntity<ApiResponse<List<SubscriptionCoverageResponse>>> getCoverage(@ModelAttribute SubscriptionCoverageFilter filter) {
        log.info("Request to get subscription coverage with filter: {}", filter);
        List<SubscriptionCoverageResponse> coverage = subscriptionService.findSubscriptionCoverage(filter);
        return ResponseEntity.ok(ApiResponse.success(coverage));
    }
}
