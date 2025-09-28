package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.TeamGender;
import co.edu.uniquindio.rosteredge.backend.repository.TeamGenderRepository;
import co.edu.uniquindio.rosteredge.backend.service.TeamGenderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TeamGenderServiceImpl extends SimpleCrudService<TeamGender> implements TeamGenderService {

    public TeamGenderServiceImpl(TeamGenderRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "TeamGender";
    }
}


