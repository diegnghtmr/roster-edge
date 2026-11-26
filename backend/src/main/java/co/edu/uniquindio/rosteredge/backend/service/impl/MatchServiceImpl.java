package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.dto.filter.MatchScheduleFilter;
import co.edu.uniquindio.rosteredge.backend.dto.request.MatchRequest;
import co.edu.uniquindio.rosteredge.backend.dto.response.MatchResponse;
import co.edu.uniquindio.rosteredge.backend.exception.BusinessException;
import co.edu.uniquindio.rosteredge.backend.model.Match;
import co.edu.uniquindio.rosteredge.backend.repository.MatchRepository;
import co.edu.uniquindio.rosteredge.backend.repository.TeamRepository;
import co.edu.uniquindio.rosteredge.backend.repository.view.MatchScheduleQueryRepository;
import co.edu.uniquindio.rosteredge.backend.service.MatchService;
import co.edu.uniquindio.rosteredge.backend.service.notification.MatchNotificationPublisher;
import co.edu.uniquindio.rosteredge.backend.service.notification.MatchTeamAssignmentService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import java.time.LocalDate;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@Slf4j
public class MatchServiceImpl extends SimpleCrudService<Match> implements MatchService {

    private final MatchRepository matchRepository;
    private final MatchScheduleQueryRepository matchScheduleQueryRepository;
    private final TeamRepository teamRepository;
    private final MatchTeamAssignmentService assignments;
    private final MatchNotificationPublisher notifications;

    public MatchServiceImpl(MatchRepository matchRepository,
                            MatchScheduleQueryRepository matchScheduleQueryRepository,
                            TeamRepository teamRepository,
                            MatchTeamAssignmentService assignments,
                            MatchNotificationPublisher notifications) {
        super(matchRepository);
        this.matchRepository = matchRepository;
        this.matchScheduleQueryRepository = matchScheduleQueryRepository;
        this.teamRepository = teamRepository;
        this.assignments = assignments;
        this.notifications = notifications;
    }

    @Override
    @CacheEvict(value = "matches", allEntries = true)
    public Match schedule(MatchRequest request) {
        validateTeams(request);
        Match match = super.save(mapToMatch(request));
        assignTeams(match, request);
        // The in-app notification and its links must commit with the match.
        notifications.publishMatchScheduled(match);
        return match;
    }

    @Override
    @CacheEvict(value = "matches", allEntries = true)
    public Match updateSchedule(Long id, MatchRequest request) {
        validateTeams(request);
        Match match = super.update(id, mapToMatch(request));
        assignTeams(match, request);
        return match;
    }

    private void validateTeams(MatchRequest request) {
        Long homeTeamId = request.getHomeTeamId();
        Long awayTeamId = request.getAwayTeamId();
        if (homeTeamId == null || awayTeamId == null) {
            throw new BusinessException("Home and away teams are required");
        }
        if (homeTeamId.equals(awayTeamId)) {
            throw new BusinessException("Home and away teams must be different");
        }
        for (Long teamId : List.of(homeTeamId, awayTeamId)) {
            if (!teamRepository.existsById(teamId)) {
                throw new BusinessException("Team not found with id: " + teamId);
            }
        }
    }

    private void assignTeams(Match match, MatchRequest request) {
        assignments.assignHomeTeam(match.getId(), request.getHomeTeamId());
        assignments.assignAwayTeam(match.getId(), request.getAwayTeamId());
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

    @Override
    protected String getEntityName() {
        return "Match";
    }

    @Override
    @Transactional(readOnly = true)
    public List<Match> findAllMatches(Long teamId, Long eventId, Long matchdayId, Long stadiumId,
                                      Boolean active, LocalDate dateFrom, LocalDate dateTo) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        log.debug("Finding matches with filters - teamId: {}, eventId: {}, matchdayId: {}, stadiumId: {}, active: {}, dateFrom: {}, dateTo: {}",
                teamId, eventId, matchdayId, stadiumId, effectiveActive, dateFrom, dateTo);
        return matchRepository.findByFilters(eventId, matchdayId, stadiumId, teamId, effectiveActive, dateFrom, dateTo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchResponse> findMatchSchedule(MatchScheduleFilter filter) {
        MatchScheduleFilter effectiveFilter = filter != null ? filter : new MatchScheduleFilter();
        if (effectiveFilter.getActive() == null) {
            effectiveFilter.setActive(Boolean.TRUE);
        }
        log.debug("Finding match schedule with filter: {}", effectiveFilter);
        return matchScheduleQueryRepository.findMatches(effectiveFilter);
    }

    @Override
    @Cacheable("matches")
    public List<Match> findByTeamId(Long teamId) {
        log.debug("Finding matches by team id: {}", teamId);
        return matchRepository.findByTeamId(teamId);
    }

    @Override
    public List<Match> findByDateBetween(LocalDate startDate, LocalDate endDate) {
        log.debug("Finding matches between {} and {}", startDate, endDate);
        return matchRepository.findByDateBetween(startDate, endDate);
    }

    @Override
    public List<Match> findActiveMatches() {
        log.debug("Finding all active matches");
        return matchRepository.findByActiveTrue();
    }

    @Override
    @CacheEvict(value = "matches", allEntries = true)
    public Match save(Match entity) {
        log.debug("Saving match");
        return super.save(entity);
    }

    @Override
    @CacheEvict(value = "matches", allEntries = true)
    public Match update(Long id, Match entity) {
        log.debug("Updating match with id: {}", id);
        return super.update(id, entity);
    }
}
