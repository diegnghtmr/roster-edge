package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.PlayerPosition;
import co.edu.uniquindio.rosteredge.backend.repository.PlayerPositionRepository;
import co.edu.uniquindio.rosteredge.backend.service.PlayerPositionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PlayerPositionServiceImpl extends SimpleCrudService<PlayerPosition> implements PlayerPositionService {

    public PlayerPositionServiceImpl(PlayerPositionRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "PlayerPosition";
    }
}


