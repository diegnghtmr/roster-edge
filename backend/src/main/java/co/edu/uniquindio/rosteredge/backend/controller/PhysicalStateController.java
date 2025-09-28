package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.PhysicalState;
import co.edu.uniquindio.rosteredge.backend.service.PhysicalStateService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/physical-states")
public class PhysicalStateController extends SimpleCrudController<PhysicalState> {

    public PhysicalStateController(PhysicalStateService service) {
        super(service);
    }
}

