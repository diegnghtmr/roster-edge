package co.edu.uniquindio.rosteredge.backend.service.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationClubEventLinkService {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Ensures the notification has a row in NotificationClubEvent referencing the given club event.
     */
    public void link(Long notificationId, Long clubEventId) {
        if (notificationId == null || clubEventId == null) {
            return;
        }
        jdbcTemplate.update(
                """
                        INSERT INTO "NotificationClubEvent" (notification_id, club_event_id)
                        VALUES (?, ?)
                        ON CONFLICT (notification_id, club_event_id) DO NOTHING
                        """,
                notificationId,
                clubEventId);
        log.debug("Linked notification {} with club event {}", notificationId, clubEventId);
    }
}
