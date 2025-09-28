package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.StaffRole;
import co.edu.uniquindio.rosteredge.backend.service.StaffRoleService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/staff-roles")
public class StaffRoleController extends SimpleCrudController<StaffRole> {

    public StaffRoleController(StaffRoleService service) {
        super(service);
    }
}

