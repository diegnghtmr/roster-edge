package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.exception.BusinessException;
import co.edu.uniquindio.rosteredge.backend.model.Team;
import co.edu.uniquindio.rosteredge.backend.repository.TeamRepository;
import co.edu.uniquindio.rosteredge.backend.service.AbstractBaseService;
import co.edu.uniquindio.rosteredge.backend.service.TeamService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
public class TeamServiceImpl extends AbstractBaseService<Team, Long> implements TeamService {
    
    private final TeamRepository teamRepository;
    
    public TeamServiceImpl(TeamRepository teamRepository) {
        super(teamRepository);
        this.teamRepository = teamRepository;
    }
    
    @Override
    protected String getEntityName() {
        return "Team";
    }
    
    @Override
    @Cacheable("teams")
    public Optional<Team> findByName(String name) {
        log.debug("Finding team by name: {}", name);
        return teamRepository.findByName(name);
    }
    
    @Override
    public List<Team> findBySport(String sport) {
        log.debug("Finding teams by sport: {}", sport);
        return teamRepository.findBySport(sport);
    }
    
    @Override
    public List<Team> findActiveTeams() {
        log.debug("Finding all active teams");
        return teamRepository.findByActiveTrue();
    }
    
    @Override
    public boolean existsByName(String name) {
        return teamRepository.existsByName(name);
    }
    
    @Override
    @CacheEvict(value = "teams", allEntries = true)
    public Team save(Team entity) {
        log.debug("Saving team: {}", entity.getName());
        
        if (entity.getId() == null && existsByName(entity.getName())) {
            throw new BusinessException("Team name already exists", "DUPLICATE_TEAM_NAME");
        }
        
        entity.prePersist();
        return super.save(entity);
    }
    
    @Override
    @CacheEvict(value = "teams", allEntries = true)
    public Team update(Long id, Team entity) {
        log.debug("Updating team with id: {}", id);
        
        Team existingTeam = findByIdOrThrow(id);
        
        if (!existingTeam.getName().equals(entity.getName()) && existsByName(entity.getName())) {
            throw new BusinessException("Team name already exists", "DUPLICATE_TEAM_NAME");
        }
        
        entity.setId(id);
        entity.setCreatedAt(existingTeam.getCreatedAt());
        entity.preUpdate();
        
        return teamRepository.save(entity);
    }
}
