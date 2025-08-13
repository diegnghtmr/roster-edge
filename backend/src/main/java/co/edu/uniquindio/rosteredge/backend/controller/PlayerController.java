package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.PlayerDTO;
import co.edu.uniquindio.rosteredge.backend.mapper.EntityMapper;
import co.edu.uniquindio.rosteredge.backend.model.Player;
import co.edu.uniquindio.rosteredge.backend.service.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/players")
@RequiredArgsConstructor
@Slf4j
public class PlayerController extends BaseController {
    
    private final PlayerService playerService;
    private final EntityMapper entityMapper;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<PlayerDTO>>> getAllPlayers() {
        log.debug("Getting all players");
        List<Player> players = playerService.findAll();
        List<PlayerDTO> playerDTOs = players.stream()
                .map(entityMapper::toPlayerDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(playerDTOs));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlayerDTO>> getPlayerById(@PathVariable Long id) {
        log.debug("Getting player with id: {}", id);
        Player player = playerService.findByIdOrThrow(id);
        PlayerDTO playerDTO = entityMapper.toPlayerDTO(player);
        return ResponseEntity.ok(ApiResponse.success(playerDTO));
    }
    
    @GetMapping("/team/{teamId}")
    public ResponseEntity<ApiResponse<List<PlayerDTO>>> getPlayersByTeam(@PathVariable Long teamId) {
        log.debug("Getting players by team id: {}", teamId);
        List<Player> players = playerService.findByTeamId(teamId);
        List<PlayerDTO> playerDTOs = players.stream()
                .map(entityMapper::toPlayerDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(playerDTOs));
    }
    
    @GetMapping("/position/{position}")
    public ResponseEntity<ApiResponse<List<PlayerDTO>>> getPlayersByPosition(@PathVariable String position) {
        log.debug("Getting players by position: {}", position);
        List<Player> players = playerService.findByPosition(position);
        List<PlayerDTO> playerDTOs = players.stream()
                .map(entityMapper::toPlayerDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(playerDTOs));
    }
    
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<PlayerDTO>>> getActivePlayers() {
        log.debug("Getting active players");
        List<Player> players = playerService.findActivePlayer();
        List<PlayerDTO> playerDTOs = players.stream()
                .map(entityMapper::toPlayerDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(playerDTOs));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<PlayerDTO>> createPlayer(
            @Valid @RequestBody PlayerDTO playerDTO,
            @RequestHeader("Authorization") String token) {
        
        log.info("Creating new player: {} {}", playerDTO.getFirstName(), playerDTO.getLastName());
        validateAdminOrCoach(token);
        
        Player player = entityMapper.toPlayerEntity(playerDTO);
        Player savedPlayer = playerService.save(player);
        PlayerDTO savedPlayerDTO = entityMapper.toPlayerDTO(savedPlayer);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(savedPlayerDTO, "Player created successfully"));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PlayerDTO>> updatePlayer(
            @PathVariable Long id,
            @Valid @RequestBody PlayerDTO playerDTO,
            @RequestHeader("Authorization") String token) {
        
        log.info("Updating player with id: {}", id);
        validateAdminOrCoach(token);
        
        // Update the player entity from DTO
        Player existingPlayer = playerService.findByIdOrThrow(id);
        entityMapper.updatePlayerEntity(existingPlayer, playerDTO);
        
        Player updatedPlayer = playerService.update(id, existingPlayer);
        PlayerDTO updatedPlayerDTO = entityMapper.toPlayerDTO(updatedPlayer);
        
        return ResponseEntity.ok(ApiResponse.success(updatedPlayerDTO, "Player updated successfully"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePlayer(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        
        log.info("Deleting player with id: {}", id);
        validateAdmin(token);
        
        playerService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Player deleted successfully"));
    }
}
