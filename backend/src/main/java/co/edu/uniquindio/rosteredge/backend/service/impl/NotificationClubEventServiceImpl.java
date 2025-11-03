package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.NotificationClubEvent;
import co.edu.uniquindio.rosteredge.backend.repository.NotificationClubEventRepository;
import co.edu.uniquindio.rosteredge.backend.service.NotificationClubEventService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationClubEventServiceImpl extends SimpleCrudService<NotificationClubEvent> implements NotificationClubEventService {

    private final NotificationClubEventRepository notificationClubEventRepository;

    public NotificationClubEventServiceImpl(NotificationClubEventRepository repository) {
        super(repository);
        this.notificationClubEventRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "NotificationClubEvent";
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationClubEvent> findByFilters(Long notificationId, Long clubEventId, Boolean active) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        return notificationClubEventRepository.findByFilters(notificationId, clubEventId, effectiveActive);
    }
}


