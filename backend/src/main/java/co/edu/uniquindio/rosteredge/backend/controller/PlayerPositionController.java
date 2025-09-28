package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.PlayerPosition;
import co.edu.uniquindio.rosteredge.backend.service.PlayerPositionService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/player-positions")
public class PlayerPositionController extends SimpleCrudController<PlayerPosition> {

    public PlayerPositionController(PlayerPositionService service) {
        super(service);
    }
}

