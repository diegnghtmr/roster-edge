package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.TeamColor;
import co.edu.uniquindio.rosteredge.backend.repository.TeamColorRepository;
import co.edu.uniquindio.rosteredge.backend.service.TeamColorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TeamColorServiceImpl extends SimpleCrudService<TeamColor> implements TeamColorService {

    public TeamColorServiceImpl(TeamColorRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "TeamColor";
    }
}


