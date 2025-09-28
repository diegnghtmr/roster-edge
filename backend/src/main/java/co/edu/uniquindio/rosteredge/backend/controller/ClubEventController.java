package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.ClubEvent;
import co.edu.uniquindio.rosteredge.backend.service.ClubEventService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/club-events")
public class ClubEventController extends SimpleCrudController<ClubEvent> {

    public ClubEventController(ClubEventService service) {
        super(service);
    }
}

