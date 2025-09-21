package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

/**
 * NotificationClubEvent entity
 * Represents relationship between notifications and club events
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("NotificationClubEvent")
public class NotificationClubEvent extends BaseEntity {

    /**
     * Notification ID
     */
    @NotNull(message = "Notification ID is required")
    private Long notificationId;

    /**
     * Club event ID
     */
    @NotNull(message = "Club event ID is required")
    private Long clubEventId;
}