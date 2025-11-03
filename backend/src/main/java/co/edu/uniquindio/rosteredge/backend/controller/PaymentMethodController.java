package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.PaymentMethod;
import co.edu.uniquindio.rosteredge.backend.service.PaymentMethodService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/payment-methods")
@Slf4j
public class PaymentMethodController extends SimpleCrudController<PaymentMethod> {

    private final PaymentMethodService paymentMethodService;

    public PaymentMethodController(PaymentMethodService service) {
        super(service);
        this.paymentMethodService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<PaymentMethod>>> findAll() {
        HttpServletRequest request = currentRequest();
        
        String name = trimToNull(request.getParameter("name"));
        Boolean active = resolveActive(parseBoolean(request.getParameter("active")));

        log.info("Request to get payment methods with filters - name: {}, active: {}", name, active);

        List<PaymentMethod> methods = paymentMethodService.findByFilters(name, active);
        return ResponseEntity.ok(ApiResponse.success(methods));
    }
}

