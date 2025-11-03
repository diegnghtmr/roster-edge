package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.MatchAwayTeam;
import co.edu.uniquindio.rosteredge.backend.repository.MatchAwayTeamRepository;
import co.edu.uniquindio.rosteredge.backend.service.MatchAwayTeamService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MatchAwayTeamServiceImpl extends SimpleCrudService<MatchAwayTeam> implements MatchAwayTeamService {

    private final MatchAwayTeamRepository matchAwayTeamRepository;

    public MatchAwayTeamServiceImpl(MatchAwayTeamRepository repository) {
        super(repository);
        this.matchAwayTeamRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "MatchAwayTeam";
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchAwayTeam> findByFilters(Long matchId, Long teamId, Boolean active) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        return matchAwayTeamRepository.findByFilters(matchId, teamId, effectiveActive);
    }
}


