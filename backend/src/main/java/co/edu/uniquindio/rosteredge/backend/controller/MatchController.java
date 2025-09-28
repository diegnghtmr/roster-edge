package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.Match;
import co.edu.uniquindio.rosteredge.backend.service.MatchService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/matches")
public class MatchController extends SimpleCrudController<Match> {

    public MatchController(MatchService service) {
        super(service);
    }
}

