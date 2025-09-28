package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.Subscription;
import co.edu.uniquindio.rosteredge.backend.service.SubscriptionService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/subscriptions")
public class SubscriptionController extends SimpleCrudController<Subscription> {

    public SubscriptionController(SubscriptionService service) {
        super(service);
    }
}

