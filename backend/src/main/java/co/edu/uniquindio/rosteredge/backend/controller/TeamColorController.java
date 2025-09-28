package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.TeamColor;
import co.edu.uniquindio.rosteredge.backend.service.TeamColorService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/team-colors")
public class TeamColorController extends SimpleCrudController<TeamColor> {

    public TeamColorController(TeamColorService service) {
        super(service);
    }
}

