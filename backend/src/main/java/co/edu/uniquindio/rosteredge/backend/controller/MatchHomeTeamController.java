package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.MatchHomeTeam;
import co.edu.uniquindio.rosteredge.backend.service.MatchHomeTeamService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/match-home-teams")
public class MatchHomeTeamController extends SimpleCrudController<MatchHomeTeam> {

    public MatchHomeTeamController(MatchHomeTeamService service) {
        super(service);
    }
}

