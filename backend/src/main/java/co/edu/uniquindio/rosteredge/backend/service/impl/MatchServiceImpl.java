package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Match;
import co.edu.uniquindio.rosteredge.backend.repository.MatchRepository;
import co.edu.uniquindio.rosteredge.backend.service.MatchService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@Slf4j
public class MatchServiceImpl extends SimpleCrudService<Match> implements MatchService {

    private final MatchRepository matchRepository;

    public MatchServiceImpl(MatchRepository matchRepository) {
        super(matchRepository);
        this.matchRepository = matchRepository;
    }

    @Override
    protected String getEntityName() {
        return "Match";
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
