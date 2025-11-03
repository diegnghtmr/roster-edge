package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.SubscriptionStatus;
import co.edu.uniquindio.rosteredge.backend.service.SubscriptionStatusService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/subscription-statuses")
@Slf4j
public class SubscriptionStatusController extends SimpleCrudController<SubscriptionStatus> {

    private final SubscriptionStatusService subscriptionStatusService;

    public SubscriptionStatusController(SubscriptionStatusService service) {
        super(service);
        this.subscriptionStatusService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<SubscriptionStatus>>> findAll() {
        HttpServletRequest request = currentRequest();
        
        String name = trimToNull(request.getParameter("name"));
        Boolean active = resolveActive(parseBoolean(request.getParameter("active")));

        log.info("Request to get subscription statuses with filters - name: {}, active: {}", name, active);

        List<SubscriptionStatus> statuses = subscriptionStatusService.findByFilters(name, active);
        return ResponseEntity.ok(ApiResponse.success(statuses));
    }
}

