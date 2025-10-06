package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.dto.filter.MatchScheduleFilter;
import co.edu.uniquindio.rosteredge.backend.dto.response.MatchResponse;
import co.edu.uniquindio.rosteredge.backend.model.Match;
import co.edu.uniquindio.rosteredge.backend.repository.MatchRepository;
import co.edu.uniquindio.rosteredge.backend.repository.view.MatchScheduleQueryRepository;
import co.edu.uniquindio.rosteredge.backend.service.MatchService;
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

    public MatchServiceImpl(MatchRepository matchRepository,
                            MatchScheduleQueryRepository matchScheduleQueryRepository) {
        super(matchRepository);
        this.matchRepository = matchRepository;
        this.matchScheduleQueryRepository = matchScheduleQueryRepository;
    }

    @Override
    protected String getEntityName() {
        return "Match";
    }

    @Override
    @Transactional(readOnly = true)
    public List<Match> findAllMatches(Long teamId, Long seasonId, Long matchdayId, Long stadiumId,
                                      Boolean active, LocalDate dateFrom, LocalDate dateTo) {
        log.debug("Finding matches with filters - teamId: {}, seasonId: {}, matchdayId: {}, stadiumId: {}, active: {}, dateFrom: {}, dateTo: {}",
                teamId, seasonId, matchdayId, stadiumId, active, dateFrom, dateTo);
        return matchRepository.findByFilters(seasonId, matchdayId, stadiumId, teamId, active, dateFrom, dateTo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchResponse> findMatchSchedule(MatchScheduleFilter filter) {
        MatchScheduleFilter effectiveFilter = filter != null ? filter : new MatchScheduleFilter();
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
