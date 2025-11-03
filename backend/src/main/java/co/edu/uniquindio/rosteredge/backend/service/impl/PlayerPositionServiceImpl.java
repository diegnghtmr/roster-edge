package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.PlayerPosition;
import co.edu.uniquindio.rosteredge.backend.repository.PlayerPositionRepository;
import co.edu.uniquindio.rosteredge.backend.service.PlayerPositionService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PlayerPositionServiceImpl extends SimpleCrudService<PlayerPosition> implements PlayerPositionService {

    private final PlayerPositionRepository playerPositionRepository;

    public PlayerPositionServiceImpl(PlayerPositionRepository repository) {
        super(repository);
        this.playerPositionRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "PlayerPosition";
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlayerPosition> findByFilters(String name, Boolean active) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        return playerPositionRepository.findByFilters(name, effectiveActive);
    }
}


