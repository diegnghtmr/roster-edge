package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.dto.response.NotificationResponse;
import co.edu.uniquindio.rosteredge.backend.model.Notification;
import co.edu.uniquindio.rosteredge.backend.repository.NotificationRepository;
import co.edu.uniquindio.rosteredge.backend.repository.view.NotificationQueryRepository;
import co.edu.uniquindio.rosteredge.backend.service.NotificationService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NotificationServiceImpl
    extends SimpleCrudService<Notification>
    implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationQueryRepository notificationQueryRepository;

    public NotificationServiceImpl(
        NotificationRepository repository,
        NotificationQueryRepository notificationQueryRepository
    ) {
        super(repository);
        this.notificationRepository = repository;
        this.notificationQueryRepository = notificationQueryRepository;
    }

    @Override
    protected String getEntityName() {
        return "Notification";
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> findByFilters(
        String message,
        Boolean active,
        LocalDateTime sendFrom,
        LocalDateTime sendTo
    ) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        return notificationRepository.findByFilters(
            message,
            effectiveActive,
            sendFrom,
            sendTo
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> findEnrichedNotifications(
        String message,
        Boolean active,
        LocalDateTime sendFrom,
        LocalDateTime sendTo
    ) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        return notificationQueryRepository.findEnrichedNotifications(
            message,
            effectiveActive,
            sendFrom,
            sendTo
        );
    }
}
