package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.filter.MatchScheduleFilter;
import co.edu.uniquindio.rosteredge.backend.dto.request.MatchRequest;
import co.edu.uniquindio.rosteredge.backend.dto.response.MatchResponse;
import co.edu.uniquindio.rosteredge.backend.exception.BusinessException;
import co.edu.uniquindio.rosteredge.backend.model.Match;
import co.edu.uniquindio.rosteredge.backend.service.MatchService;
import co.edu.uniquindio.rosteredge.backend.service.notification.MatchNotificationPublisher;
import co.edu.uniquindio.rosteredge.backend.service.notification.MatchTeamAssignmentService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
@Slf4j
public class MatchController extends BaseController {

    private final MatchService matchService;
    private final MatchTeamAssignmentService matchTeamAssignmentService;
    private final MatchNotificationPublisher matchNotificationPublisher;

    @PostMapping("/")
    public ResponseEntity<ApiResponse<Match>> createMatch(@Valid @RequestBody MatchRequest request) {
        log.info("Request to create match on date: {}", request.getDate());
        validateTeams(request.getHomeTeamId(), request.getAwayTeamId());
        Match createdMatch = matchService.save(mapToMatch(request));
        upsertTeams(createdMatch.getId(), request.getHomeTeamId(), request.getAwayTeamId());
        matchNotificationPublisher.publishMatchScheduled(createdMatch);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdMatch, "Match created successfully"));
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<Match>>> getMatches(
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) Long matchdayId,
            @RequestParam(required = false) Long stadiumId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {
        Boolean effectiveActive = resolveActive(active);
        log.info("Request to get matches with filters - teamId: {}, eventId: {}, matchdayId: {}, stadiumId: {}, active: {}, dateFrom: {}, dateTo: {}",
                teamId, eventId, matchdayId, stadiumId, effectiveActive, dateFrom, dateTo);
        List<Match> matches = matchService.findAllMatches(teamId, eventId, matchdayId, stadiumId, effectiveActive, dateFrom, dateTo);
        return ResponseEntity.ok(ApiResponse.success(matches));
    }

    @GetMapping("/schedule/")
    public ResponseEntity<ApiResponse<List<MatchResponse>>> getMatchSchedule(@ModelAttribute MatchScheduleFilter filter) {
        log.info("Request to get match schedule with filter: {}", filter);
        List<MatchResponse> schedule = matchService.findMatchSchedule(filter);
        return ResponseEntity.ok(ApiResponse.success(schedule));
    }

    @GetMapping("/{id}/")
    public ResponseEntity<ApiResponse<Match>> getMatchById(@PathVariable Long id) {
        log.info("Request to get match by id: {}", id);
        Match match = matchService.findByIdOrThrow(id);
        return ResponseEntity.ok(ApiResponse.success(match));
    }

    @PutMapping("/{id}/")
    public ResponseEntity<ApiResponse<Match>> updateMatch(@PathVariable Long id,
                                                          @Valid @RequestBody MatchRequest request) {
        log.info("Request to update match with id: {}", id);
        validateTeams(request.getHomeTeamId(), request.getAwayTeamId());
        Match updatedMatch = matchService.update(id, mapToMatch(request));
        upsertTeams(updatedMatch.getId(), request.getHomeTeamId(), request.getAwayTeamId());
        return ResponseEntity.ok(ApiResponse.success(updatedMatch, "Match updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMatch(@PathVariable Long id) {
        log.info("Request to delete match with id: {}", id);
        matchService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Match deleted successfully"));
    }

    private Match mapToMatch(MatchRequest request) {
        return Match.builder()
                .matchdayId(request.getMatchdayId())
                .eventId(request.getEventId())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .date(request.getDate())
                .stadiumId(request.getStadiumId())
                .active(request.getActive())
                .build();
    }

    private void validateTeams(Long homeTeamId, Long awayTeamId) {
        if (homeTeamId == null || awayTeamId == null) {
            throw new BusinessException("Home and away teams are required");
        }
        if (Objects.equals(homeTeamId, awayTeamId)) {
            throw new BusinessException("Home and away teams must be different");
        }
    }

    private void upsertTeams(Long matchId, Long homeTeamId, Long awayTeamId) {
        matchTeamAssignmentService.assignHomeTeam(matchId, homeTeamId);
        matchTeamAssignmentService.assignAwayTeam(matchId, awayTeamId);
    }
}
