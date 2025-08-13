package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.exception.BusinessException;
import co.edu.uniquindio.rosteredge.backend.model.Match;
import co.edu.uniquindio.rosteredge.backend.repository.MatchRepository;
import co.edu.uniquindio.rosteredge.backend.service.AbstractBaseService;
import co.edu.uniquindio.rosteredge.backend.service.MatchService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@Slf4j
public class MatchServiceImpl extends AbstractBaseService<Match, Long> implements MatchService {
    
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
    public List<Match> findByStatus(String status) {
        log.debug("Finding matches by status: {}", status);
        return matchRepository.findByStatus(status);
    }
    
    @Override
    public List<Match> findByMatchDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        log.debug("Finding matches between {} and {}", startDate, endDate);
        return matchRepository.findByMatchDateBetween(startDate, endDate);
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
        
        // Validate that home and away teams are different
        if (entity.getHomeTeamId() != null && entity.getHomeTeamId().equals(entity.getAwayTeamId())) {
            throw new BusinessException("Home and away teams must be different", "SAME_TEAMS");
        }
        
        entity.prePersist();
        return super.save(entity);
    }
    
    @Override
    @CacheEvict(value = "matches", allEntries = true)
    public Match update(Long id, Match entity) {
        log.debug("Updating match with id: {}", id);
        
        Match existingMatch = findByIdOrThrow(id);
        
        // Validate that home and away teams are different
        if (entity.getHomeTeamId() != null && entity.getHomeTeamId().equals(entity.getAwayTeamId())) {
            throw new BusinessException("Home and away teams must be different", "SAME_TEAMS");
        }
        
        entity.setId(id);
        entity.setCreatedAt(existingMatch.getCreatedAt());
        entity.preUpdate();
        
        return matchRepository.save(entity);
    }
}
