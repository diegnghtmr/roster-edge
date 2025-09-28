package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Notification;
import co.edu.uniquindio.rosteredge.backend.repository.NotificationRepository;
import co.edu.uniquindio.rosteredge.backend.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NotificationServiceImpl extends SimpleCrudService<Notification> implements NotificationService {

    public NotificationServiceImpl(NotificationRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "Notification";
    }
}


