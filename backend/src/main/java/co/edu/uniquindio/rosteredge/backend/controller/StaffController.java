package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.Staff;
import co.edu.uniquindio.rosteredge.backend.service.StaffService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/staff")
public class StaffController extends SimpleCrudController<Staff> {

    public StaffController(StaffService service) {
        super(service);
    }
}

