package co.edu.uniquindio.rosteredge.backend.repository.view;

import co.edu.uniquindio.rosteredge.backend.dto.response.NotificationResponse;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * Repository for enriched notification queries with club and event information
 */
@Repository
@RequiredArgsConstructor
public class NotificationQueryRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public List<NotificationResponse> findEnrichedNotifications(
        String message,
        Boolean active,
        LocalDateTime sendFrom,
        LocalDateTime sendTo
    ) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        StringBuilder sql = new StringBuilder()
            .append(
                "SELECT n.id, n.created_at, n.updated_at, n.active, n.message, n.send_date, \n"
            )
            .append("       ce.club_id, c.name AS club_name, \n")
            .append(
                "       ce.event_id, e.name AS event_name, e.date AS event_date \n"
            )
            .append("FROM \"Notification\" n \n")
            .append(
                "LEFT JOIN \"NotificationClubEvent\" nce ON n.id = nce.notification_id \n"
            )
            .append(
                "LEFT JOIN \"ClubEvent\" ce ON nce.club_event_id = ce.id \n"
            )
            .append("LEFT JOIN \"Club\" c ON ce.club_id = c.id \n")
            .append("LEFT JOIN \"Event\" e ON ce.event_id = e.id \n")
            .append("WHERE 1 = 1");

        if (message != null) {
            sql.append(
                " AND LOWER(n.message) LIKE LOWER(CONCAT('%', :message, '%'))"
            );
            parameters.addValue("message", message);
        }
        if (active != null) {
            sql.append(" AND n.active = :active");
            parameters.addValue("active", active);
        }
        if (sendFrom != null) {
            sql.append(" AND n.send_date >= :sendFrom");
            parameters.addValue("sendFrom", sendFrom);
        }
        if (sendTo != null) {
            sql.append(" AND n.send_date <= :sendTo");
            parameters.addValue("sendTo", sendTo);
        }

        sql.append(" ORDER BY n.send_date DESC, n.id DESC");

        List<NotificationResponse> rawResults = jdbcTemplate.query(
            sql.toString(),
            parameters,
            this::mapRawResult
        );
        return groupNotificationsByRelatedData(rawResults);
    }

    private NotificationResponse.RelatedClubEvent mapRelatedClubEvent(
        ResultSet rs
    ) throws SQLException {
        Long clubId = rs.getObject("club_id", Long.class);
        if (clubId == null) {
            return null;
        }

        return NotificationResponse.RelatedClubEvent.builder()
            .clubId(clubId)
            .clubName(rs.getString("club_name"))
            .eventId(rs.getObject("event_id", Long.class))
            .eventName(rs.getString("event_name"))
            .eventDate(rs.getObject("event_date", java.time.LocalDate.class))
            .build();
    }

    private NotificationResponse mapRawResult(ResultSet rs, int rowNum)
        throws SQLException {
        NotificationResponse.RelatedClubEvent relatedClubEvent =
            mapRelatedClubEvent(rs);

        return NotificationResponse.builder()
            .id(rs.getLong("id"))
            .createdAt(rs.getObject("created_at", LocalDateTime.class))
            .updatedAt(rs.getObject("updated_at", LocalDateTime.class))
            .active(rs.getObject("active", Boolean.class))
            .message(rs.getString("message"))
            .sendDate(rs.getObject("send_date", LocalDateTime.class))
            .relatedClubEvents(
                relatedClubEvent != null
                    ? List.of(relatedClubEvent)
                    : new ArrayList<>()
            )
            .build();
    }

    private List<NotificationResponse> groupNotificationsByRelatedData(
        List<NotificationResponse> rawResults
    ) {
        Map<Long, NotificationResponse> groupedNotifications = new HashMap<>();

        for (NotificationResponse rawResult : rawResults) {
            Long notificationId = rawResult.getId();

            if (!groupedNotifications.containsKey(notificationId)) {
                // First time seeing this notification, create base object
                groupedNotifications.put(
                    notificationId,
                    NotificationResponse.builder()
                        .id(rawResult.getId())
                        .createdAt(rawResult.getCreatedAt())
                        .updatedAt(rawResult.getUpdatedAt())
                        .active(rawResult.getActive())
                        .message(rawResult.getMessage())
                        .sendDate(rawResult.getSendDate())
                        .relatedClubEvents(new ArrayList<>())
                        .build()
                );
            }

            // Add related club events if they exist
            if (!rawResult.getRelatedClubEvents().isEmpty()) {
                NotificationResponse groupedNotification =
                    groupedNotifications.get(notificationId);
                NotificationResponse.RelatedClubEvent relatedClubEvent =
                    rawResult.getRelatedClubEvents().get(0);

                // Check if this club-event combination already exists
                boolean exists = groupedNotification
                    .getRelatedClubEvents()
                    .stream()
                    .anyMatch(
                        existing ->
                            existing
                                .getClubId()
                                .equals(relatedClubEvent.getClubId()) &&
                            existing
                                .getEventId()
                                .equals(relatedClubEvent.getEventId())
                    );

                if (!exists) {
                    groupedNotification
                        .getRelatedClubEvents()
                        .add(relatedClubEvent);
                }
            }
        }

        return new ArrayList<>(groupedNotifications.values());
    }
}
