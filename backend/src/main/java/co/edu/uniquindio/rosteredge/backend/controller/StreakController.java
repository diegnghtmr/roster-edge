package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.Streak;
import co.edu.uniquindio.rosteredge.backend.service.StreakService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/streaks")
public class StreakController extends SimpleCrudController<Streak> {

    public StreakController(StreakService service) {
        super(service);
    }
}

