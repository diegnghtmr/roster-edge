package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.Matchday;
import co.edu.uniquindio.rosteredge.backend.service.MatchdayService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/matchdays")
public class MatchdayController extends SimpleCrudController<Matchday> {

    public MatchdayController(MatchdayService service) {
        super(service);
    }
}

