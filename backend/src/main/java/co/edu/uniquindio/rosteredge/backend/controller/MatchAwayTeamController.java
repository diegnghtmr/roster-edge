package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.MatchAwayTeam;
import co.edu.uniquindio.rosteredge.backend.service.MatchAwayTeamService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/match-away-teams")
public class MatchAwayTeamController extends SimpleCrudController<MatchAwayTeam> {

    public MatchAwayTeamController(MatchAwayTeamService service) {
        super(service);
    }
}

