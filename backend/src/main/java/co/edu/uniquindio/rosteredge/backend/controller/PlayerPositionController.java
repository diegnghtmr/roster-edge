package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.PlayerPosition;
import co.edu.uniquindio.rosteredge.backend.service.PlayerPositionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/player-positions")
@Slf4j
public class PlayerPositionController extends SimpleCrudController<PlayerPosition> {

    private final PlayerPositionService playerPositionService;

    public PlayerPositionController(PlayerPositionService service) {
        super(service);
        this.playerPositionService = service;
    }

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<PlayerPosition>>> findAll() {
        HttpServletRequest request = currentRequest();
        
        String name = trimToNull(request.getParameter("name"));
        Boolean active = parseBoolean(request.getParameter("active"));

        log.info("Request to get player positions with filters - name: {}, active: {}", name, active);

        List<PlayerPosition> positions = playerPositionService.findByFilters(name, active);
        return ResponseEntity.ok(ApiResponse.success(positions));
    }
}

