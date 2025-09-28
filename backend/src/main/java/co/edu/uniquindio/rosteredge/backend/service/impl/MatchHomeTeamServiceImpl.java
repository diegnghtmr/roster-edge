package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.MatchHomeTeam;
import co.edu.uniquindio.rosteredge.backend.repository.MatchHomeTeamRepository;
import co.edu.uniquindio.rosteredge.backend.service.MatchHomeTeamService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MatchHomeTeamServiceImpl extends SimpleCrudService<MatchHomeTeam> implements MatchHomeTeamService {

    public MatchHomeTeamServiceImpl(MatchHomeTeamRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "MatchHomeTeam";
    }
}


