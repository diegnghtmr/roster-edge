package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.PaymentMethod;
import co.edu.uniquindio.rosteredge.backend.service.PaymentMethodService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payment-methods")
public class PaymentMethodController extends SimpleCrudController<PaymentMethod> {

    public PaymentMethodController(PaymentMethodService service) {
        super(service);
    }
}

