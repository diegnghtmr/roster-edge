package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.MatchDTO;
import co.edu.uniquindio.rosteredge.backend.mapper.EntityMapper;
import co.edu.uniquindio.rosteredge.backend.model.Match;
import co.edu.uniquindio.rosteredge.backend.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
@Slf4j
public class MatchController extends BaseController {
    
    private final MatchService matchService;
    private final EntityMapper entityMapper;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchDTO>>> getAllMatches() {
        log.debug("Getting all matches");
        List<Match> matches = matchService.findAll();
        List<MatchDTO> matchDTOs = matches.stream()
                .map(entityMapper::toMatchDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(matchDTOs));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MatchDTO>> getMatchById(@PathVariable Long id) {
        log.debug("Getting match with id: {}", id);
        Match match = matchService.findByIdOrThrow(id);
        MatchDTO matchDTO = entityMapper.toMatchDTO(match);
        return ResponseEntity.ok(ApiResponse.success(matchDTO));
    }
    
    @GetMapping("/team/{teamId}")
    public ResponseEntity<ApiResponse<List<MatchDTO>>> getMatchesByTeam(@PathVariable Long teamId) {
        log.debug("Getting matches by team id: {}", teamId);
        List<Match> matches = matchService.findByTeamId(teamId);
        List<MatchDTO> matchDTOs = matches.stream()
                .map(entityMapper::toMatchDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(matchDTOs));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<MatchDTO>>> getMatchesByStatus(@PathVariable String status) {
        log.debug("Getting matches by status: {}", status);
        List<Match> matches = matchService.findByStatus(status);
        List<MatchDTO> matchDTOs = matches.stream()
                .map(entityMapper::toMatchDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(matchDTOs));
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse<List<MatchDTO>>> getMatchesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.debug("Getting matches between {} and {}", startDate, endDate);
        List<Match> matches = matchService.findByMatchDateBetween(startDate, endDate);
        List<MatchDTO> matchDTOs = matches.stream()
                .map(entityMapper::toMatchDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(matchDTOs));
    }
    
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<MatchDTO>>> getActiveMatches() {
        log.debug("Getting active matches");
        List<Match> matches = matchService.findActiveMatches();
        List<MatchDTO> matchDTOs = matches.stream()
                .map(entityMapper::toMatchDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(matchDTOs));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<MatchDTO>> createMatch(
            @Valid @RequestBody MatchDTO matchDTO,
            @RequestHeader("Authorization") String token) {
        
        log.info("Creating new match");
        validateAdminOrCoach(token);
        
        Match match = entityMapper.toMatchEntity(matchDTO);
        Match savedMatch = matchService.save(match);
        MatchDTO savedMatchDTO = entityMapper.toMatchDTO(savedMatch);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(savedMatchDTO, "Match created successfully"));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MatchDTO>> updateMatch(
            @PathVariable Long id,
            @Valid @RequestBody MatchDTO matchDTO,
            @RequestHeader("Authorization") String token) {
        
        log.info("Updating match with id: {}", id);
        validateAdminOrCoach(token);
        
        // Update the match entity from DTO
        Match existingMatch = matchService.findByIdOrThrow(id);
        entityMapper.updateMatchEntity(existingMatch, matchDTO);
        
        Match updatedMatch = matchService.update(id, existingMatch);
        MatchDTO updatedMatchDTO = entityMapper.toMatchDTO(updatedMatch);
        
        return ResponseEntity.ok(ApiResponse.success(updatedMatchDTO, "Match updated successfully"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMatch(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        
        log.info("Deleting match with id: {}", id);
        validateAdmin(token);
        
        matchService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Match deleted successfully"));
    }
}
