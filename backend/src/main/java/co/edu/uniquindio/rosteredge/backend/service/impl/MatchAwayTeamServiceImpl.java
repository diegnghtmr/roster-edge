package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.MatchAwayTeam;
import co.edu.uniquindio.rosteredge.backend.repository.MatchAwayTeamRepository;
import co.edu.uniquindio.rosteredge.backend.service.MatchAwayTeamService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MatchAwayTeamServiceImpl extends SimpleCrudService<MatchAwayTeam> implements MatchAwayTeamService {

    public MatchAwayTeamServiceImpl(MatchAwayTeamRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "MatchAwayTeam";
    }
}


