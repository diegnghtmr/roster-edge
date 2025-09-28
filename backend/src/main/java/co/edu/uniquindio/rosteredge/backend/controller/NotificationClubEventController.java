package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.NotificationClubEvent;
import co.edu.uniquindio.rosteredge.backend.service.NotificationClubEventService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notification-club-events")
public class NotificationClubEventController extends SimpleCrudController<NotificationClubEvent> {

    public NotificationClubEventController(NotificationClubEventService service) {
        super(service);
    }
}

