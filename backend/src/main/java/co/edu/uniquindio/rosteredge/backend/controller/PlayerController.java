package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.PlayerDTO;
import co.edu.uniquindio.rosteredge.backend.dto.filter.PlayerOverviewFilter;
import co.edu.uniquindio.rosteredge.backend.dto.response.PlayerResponse;
import co.edu.uniquindio.rosteredge.backend.service.PlayerService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/players")
@RequiredArgsConstructor
@Slf4j
public class PlayerController extends BaseController {

    private final PlayerService playerService;

    @PostMapping("/")
    public ResponseEntity<ApiResponse<PlayerDTO>> createPlayer(@Valid @RequestBody PlayerDTO playerDTO) {
        log.info("Request to create player: {}", playerDTO.getName());
        PlayerDTO createdPlayer = playerService.createPlayer(playerDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdPlayer, "Player created successfully"));
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<PlayerDTO>>> getAllPlayers(
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) Long primaryPositionId,
            @RequestParam(required = false) Boolean active) {
        log.info("Request to get players with filters - teamId: {}, primaryPositionId: {}, active: {}",
                teamId, primaryPositionId, active);
        List<PlayerDTO> players = playerService.findAllPlayers(teamId, primaryPositionId, active);
        return ResponseEntity.ok(ApiResponse.success(players));
    }

    @GetMapping("/overview/")
    public ResponseEntity<ApiResponse<List<PlayerResponse>>> getPlayersOverview(@ModelAttribute PlayerOverviewFilter filter) {
        log.info("Request to get players overview with filter: {}", filter);
        List<PlayerResponse> overview = playerService.findPlayersOverview(filter);
        return ResponseEntity.ok(ApiResponse.success(overview));
    }

    @GetMapping("/{id}/")
    public ResponseEntity<ApiResponse<PlayerDTO>> getPlayerById(@PathVariable Long id) {
        log.info("Request to get player by id: {}", id);
        PlayerDTO player = playerService.findPlayerById(id);
        return ResponseEntity.ok(ApiResponse.success(player));
    }

    @PutMapping("/{id}/")
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
