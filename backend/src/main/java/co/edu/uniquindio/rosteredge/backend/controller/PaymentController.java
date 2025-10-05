package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.Payment;
import co.edu.uniquindio.rosteredge.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/payments")
@Slf4j
public class PaymentController extends SimpleCrudController<Payment> {

    private final PaymentService paymentService;

    public PaymentController(PaymentService service) {
        super(service);
        this.paymentService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<Payment>>> findAll() {
        HttpServletRequest request = currentRequest();
        Long paymentMethodId = parseLong(request.getParameter("paymentMethodId"));
        Long currencyId = parseLong(request.getParameter("currencyId"));
        Long planId = parseLong(request.getParameter("planId"));
        Boolean active = parseBoolean(request.getParameter("active"));
        LocalDateTime paymentDateFrom = parseDateTime(request.getParameter("paymentDateFrom"));
        LocalDateTime paymentDateTo = parseDateTime(request.getParameter("paymentDateTo"));
        BigDecimal amountFrom = parseBigDecimal(request.getParameter("amountFrom"));
        BigDecimal amountTo = parseBigDecimal(request.getParameter("amountTo"));

        log.info("Request to get payments with filters - paymentMethodId: {}, currencyId: {}, planId: {}, active: {}, paymentDateFrom: {}, paymentDateTo: {}, amountFrom: {}, amountTo: {}",
                paymentMethodId, currencyId, planId, active, paymentDateFrom, paymentDateTo, amountFrom, amountTo);

        List<Payment> payments = paymentService.findByFilters(paymentMethodId, currencyId, planId, active,
                paymentDateFrom, paymentDateTo, amountFrom, amountTo);
        return ResponseEntity.ok(ApiResponse.success(payments));
    }
}

