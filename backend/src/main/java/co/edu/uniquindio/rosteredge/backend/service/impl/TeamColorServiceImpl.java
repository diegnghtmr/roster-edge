package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.TeamColor;
import co.edu.uniquindio.rosteredge.backend.repository.TeamColorRepository;
import co.edu.uniquindio.rosteredge.backend.service.TeamColorService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TeamColorServiceImpl extends SimpleCrudService<TeamColor> implements TeamColorService {

    private final TeamColorRepository teamColorRepository;

    public TeamColorServiceImpl(TeamColorRepository repository) {
        super(repository);
        this.teamColorRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "TeamColor";
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamColor> findByFilters(Long teamId, Long colorId, Boolean active) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        return teamColorRepository.findByFilters(teamId, colorId, effectiveActive);
    }
}


