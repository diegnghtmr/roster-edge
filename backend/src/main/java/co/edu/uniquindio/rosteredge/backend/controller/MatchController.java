package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.Match;
import co.edu.uniquindio.rosteredge.backend.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
@Slf4j
public class MatchController extends BaseController {

    private final MatchService matchService;

    @PostMapping("/")
    public ResponseEntity<ApiResponse<Match>> createMatch(@Valid @RequestBody Match match) {
        log.info("Request to create match on date: {}", match.getDate());
        Match createdMatch = matchService.save(match);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdMatch, "Match created successfully"));
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<Match>>> getMatches(
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) Long seasonId,
            @RequestParam(required = false) Long matchdayId,
            @RequestParam(required = false) Long stadiumId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {
        log.info("Request to get matches with filters - teamId: {}, seasonId: {}, matchdayId: {}, stadiumId: {}, active: {}, dateFrom: {}, dateTo: {}",
                teamId, seasonId, matchdayId, stadiumId, active, dateFrom, dateTo);
        List<Match> matches = matchService.findAllMatches(teamId, seasonId, matchdayId, stadiumId, active, dateFrom, dateTo);
        return ResponseEntity.ok(ApiResponse.success(matches));
    }

    @GetMapping("/{id}/")
    public ResponseEntity<ApiResponse<Match>> getMatchById(@PathVariable Long id) {
        log.info("Request to get match by id: {}", id);
        Match match = matchService.findByIdOrThrow(id);
        return ResponseEntity.ok(ApiResponse.success(match));
    }

    @PutMapping("/{id}/")
    public ResponseEntity<ApiResponse<Match>> updateMatch(@PathVariable Long id, @Valid @RequestBody Match match) {
        log.info("Request to update match with id: {}", id);
        Match updatedMatch = matchService.update(id, match);
        return ResponseEntity.ok(ApiResponse.success(updatedMatch, "Match updated successfully"));
    }

    @DeleteMapping("/{id}/")
    public ResponseEntity<ApiResponse<Void>> deleteMatch(@PathVariable Long id) {
        log.info("Request to delete match with id: {}", id);
        matchService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Match deleted successfully"));
    }
}
