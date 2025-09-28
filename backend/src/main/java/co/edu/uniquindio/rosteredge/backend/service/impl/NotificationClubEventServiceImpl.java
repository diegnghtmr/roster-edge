package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.NotificationClubEvent;
import co.edu.uniquindio.rosteredge.backend.repository.NotificationClubEventRepository;
import co.edu.uniquindio.rosteredge.backend.service.NotificationClubEventService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NotificationClubEventServiceImpl extends SimpleCrudService<NotificationClubEvent> implements NotificationClubEventService {

    public NotificationClubEventServiceImpl(NotificationClubEventRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "NotificationClubEvent";
    }
}


