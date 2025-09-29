package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.PlayerDTO;
import co.edu.uniquindio.rosteredge.backend.service.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/players")
@RequiredArgsConstructor
@Slf4j
public class PlayerController extends BaseController {

    private final PlayerService playerService;

    @PostMapping
    public ResponseEntity<ApiResponse<PlayerDTO>> createPlayer(@Valid @RequestBody PlayerDTO playerDTO) {
        log.info("Request to create player: {}", playerDTO.getName());
        PlayerDTO createdPlayer = playerService.createPlayer(playerDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdPlayer, "Player created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PlayerDTO>>> getAllPlayers(
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) Long primaryPositionId,
            @RequestParam(required = false) Boolean active) {
        log.info("Request to get players with filters - teamId: {}, primaryPositionId: {}, active: {}",
                teamId, primaryPositionId, active);
        List<PlayerDTO> players = playerService.findAllPlayers(teamId, primaryPositionId, active);
        return ResponseEntity.ok(ApiResponse.success(players));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlayerDTO>> getPlayerById(@PathVariable Long id) {
        log.info("Request to get player by id: {}", id);
        PlayerDTO player = playerService.findPlayerById(id);
        return ResponseEntity.ok(ApiResponse.success(player));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PlayerDTO>> updatePlayer(@PathVariable Long id, @Valid @RequestBody PlayerDTO playerDTO) {
        log.info("Request to update player with id: {}", id);
        PlayerDTO updatedPlayer = playerService.updatePlayer(id, playerDTO);
        return ResponseEntity.ok(ApiResponse.success(updatedPlayer, "Player updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePlayer(@PathVariable Long id) {
        log.info("Request to delete player with id: {}", id);
        playerService.deletePlayer(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Player deleted successfully"));
    }
}
