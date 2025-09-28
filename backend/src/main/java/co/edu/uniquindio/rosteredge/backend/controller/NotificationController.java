package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.Notification;
import co.edu.uniquindio.rosteredge.backend.service.NotificationService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications")
public class NotificationController extends SimpleCrudController<Notification> {

    public NotificationController(NotificationService service) {
        super(service);
    }
}

