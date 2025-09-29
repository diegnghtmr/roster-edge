package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Notification;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends BaseRepository<Notification, Long> {

    @Query("SELECT * FROM \"Notification\" WHERE (:message IS NULL OR LOWER(message) LIKE LOWER(CONCAT('%', :message, '%'))) " +
           "AND (:active IS NULL OR active = :active) " +
           "AND (:sendFrom IS NULL OR send_date >= :sendFrom) " +
           "AND (:sendTo IS NULL OR send_date <= :sendTo)")
    List<Notification> findByFilters(@Param("message") String message,
                                     @Param("active") Boolean active,
                                     @Param("sendFrom") LocalDateTime sendFrom,
                                     @Param("sendTo") LocalDateTime sendTo);
}

