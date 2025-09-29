package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.MatchHomeTeam;
import co.edu.uniquindio.rosteredge.backend.repository.MatchHomeTeamRepository;
import co.edu.uniquindio.rosteredge.backend.service.MatchHomeTeamService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MatchHomeTeamServiceImpl extends SimpleCrudService<MatchHomeTeam> implements MatchHomeTeamService {

    private final MatchHomeTeamRepository matchHomeTeamRepository;

    public MatchHomeTeamServiceImpl(MatchHomeTeamRepository repository) {
        super(repository);
        this.matchHomeTeamRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "MatchHomeTeam";
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchHomeTeam> findByFilters(Long matchId, Long teamId, Boolean active) {
        return matchHomeTeamRepository.findByFilters(matchId, teamId, active);
    }
}


