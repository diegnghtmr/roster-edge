package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Player;
import co.edu.uniquindio.rosteredge.backend.repository.PlayerRepository;
import co.edu.uniquindio.rosteredge.backend.service.AbstractBaseService;
import co.edu.uniquindio.rosteredge.backend.service.PlayerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@Slf4j
public class PlayerServiceImpl extends AbstractBaseService<Player, Long> implements PlayerService {
    
    private final PlayerRepository playerRepository;
    
    public PlayerServiceImpl(PlayerRepository playerRepository) {
        super(playerRepository);
        this.playerRepository = playerRepository;
    }
    
    @Override
    protected String getEntityName() {
        return "Player";
    }
    
    @Override
    @Cacheable("players")
    public List<Player> findByTeamId(Long teamId) {
        log.debug("Finding players by team id: {}", teamId);
        return playerRepository.findByTeamId(teamId);
    }
    
    @Override
    public List<Player> findByPosition(String position) {
        log.debug("Finding players by position: {}", position);
        return playerRepository.findByPosition(position);
    }
    
    @Override
    public List<Player> findActivePlayer() {
        log.debug("Finding all active players");
        return playerRepository.findByActiveTrue();
    }
    
    @Override
    @CacheEvict(value = "players", allEntries = true)
    public Player save(Player entity) {
        log.debug("Saving player: {} {}", entity.getFirstName(), entity.getLastName());
        entity.prePersist();
        return super.save(entity);
    }
    
    @Override
    @CacheEvict(value = "players", allEntries = true)
    public Player update(Long id, Player entity) {
        log.debug("Updating player with id: {}", id);
        
        Player existingPlayer = findByIdOrThrow(id);
        
        entity.setId(id);
        entity.setCreatedAt(existingPlayer.getCreatedAt());
        entity.preUpdate();
        
        return playerRepository.save(entity);
    }
}
