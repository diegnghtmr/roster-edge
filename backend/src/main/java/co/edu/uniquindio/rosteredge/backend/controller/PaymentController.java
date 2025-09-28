package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.Payment;
import co.edu.uniquindio.rosteredge.backend.service.PaymentService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
public class PaymentController extends SimpleCrudController<Payment> {

    public PaymentController(PaymentService service) {
        super(service);
    }
}

