package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.NotificationClubEvent;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationClubEventRepository extends BaseRepository<NotificationClubEvent, Long> {

    @Query("SELECT * FROM \"NotificationClubEvent\" WHERE (:notificationId IS NULL OR notification_id = :notificationId) " +
           "AND (:clubEventId IS NULL OR club_event_id = :clubEventId) " +
           "AND (:active IS NULL OR active = :active)")
    List<NotificationClubEvent> findByFilters(@Param("notificationId") Long notificationId,
                                              @Param("clubEventId") Long clubEventId,
                                              @Param("active") Boolean active);
}

