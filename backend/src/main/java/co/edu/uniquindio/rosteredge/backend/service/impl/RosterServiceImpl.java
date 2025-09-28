package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Roster;
import co.edu.uniquindio.rosteredge.backend.repository.RosterRepository;
import co.edu.uniquindio.rosteredge.backend.service.RosterService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RosterServiceImpl extends SimpleCrudService<Roster> implements RosterService {

    public RosterServiceImpl(RosterRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "Roster";
    }
}


