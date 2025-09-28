package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.ClubEvent;
import co.edu.uniquindio.rosteredge.backend.repository.ClubEventRepository;
import co.edu.uniquindio.rosteredge.backend.service.ClubEventService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ClubEventServiceImpl extends SimpleCrudService<ClubEvent> implements ClubEventService {

    public ClubEventServiceImpl(ClubEventRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "ClubEvent";
    }
}


