package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Notification;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationService extends CrudService<Notification> {

    List<Notification> findByFilters(String message, String status, Boolean active,
                                     LocalDateTime sendFrom, LocalDateTime sendTo);
}
