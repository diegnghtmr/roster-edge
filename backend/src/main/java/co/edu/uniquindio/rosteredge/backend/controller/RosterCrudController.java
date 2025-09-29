package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.Roster;
import co.edu.uniquindio.rosteredge.backend.service.RosterService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rosters")
public class RosterCrudController extends SimpleCrudController<Roster> {

    public RosterCrudController(RosterService service) {
        super(service);
    }
}


