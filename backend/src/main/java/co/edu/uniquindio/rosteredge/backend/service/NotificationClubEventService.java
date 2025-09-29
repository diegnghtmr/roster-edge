package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.NotificationClubEvent;

import java.util.List;

public interface NotificationClubEventService extends CrudService<NotificationClubEvent> {

    List<NotificationClubEvent> findByFilters(Long notificationId, Long clubEventId, Boolean active);
}

