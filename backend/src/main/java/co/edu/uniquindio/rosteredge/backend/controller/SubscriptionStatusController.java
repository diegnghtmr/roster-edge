package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.SubscriptionStatus;
import co.edu.uniquindio.rosteredge.backend.service.SubscriptionStatusService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/subscription-statuses")
public class SubscriptionStatusController extends SimpleCrudController<SubscriptionStatus> {

    public SubscriptionStatusController(SubscriptionStatusService service) {
        super(service);
    }
}

