package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Notification;
import co.edu.uniquindio.rosteredge.backend.repository.NotificationRepository;
import co.edu.uniquindio.rosteredge.backend.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class NotificationServiceImpl extends SimpleCrudService<Notification> implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository repository) {
        super(repository);
        this.notificationRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "Notification";
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> findByFilters(String message, Boolean active,
                                            LocalDateTime sendFrom, LocalDateTime sendTo) {
        return notificationRepository.findByFilters(message, active, sendFrom, sendTo);
    }
}


