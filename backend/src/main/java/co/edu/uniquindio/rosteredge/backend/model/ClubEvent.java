package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

/**
 * ClubEvent entity
 * Represents relationship of clubs participating in sports events
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("ClubEvent")
public class ClubEvent extends BaseEntity {

    /**
     * Club ID
     */
    @NotNull(message = "Club ID is required")
    private Long clubId;

    /**
     * Event ID
     */
    @NotNull(message = "Event ID is required")
    private Long eventId;
}