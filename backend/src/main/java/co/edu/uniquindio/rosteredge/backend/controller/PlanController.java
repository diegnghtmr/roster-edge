package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.Plan;
import co.edu.uniquindio.rosteredge.backend.service.PlanService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/plans")
public class PlanController extends SimpleCrudController<Plan> {

    public PlanController(PlanService service) {
        super(service);
    }
}

