package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.PlanBenefit;
import co.edu.uniquindio.rosteredge.backend.service.PlanBenefitService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/plan-benefits")
public class PlanBenefitController extends SimpleCrudController<PlanBenefit> {

    public PlanBenefitController(PlanBenefitService service) {
        super(service);
    }
}

