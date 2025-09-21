package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

/**
 * Event entity
 * Represents team events
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Event")
public class Event extends BaseEntity {

    /**
     * Season ID
     */
    @NotNull(message = "Season ID is required")
    private Long seasonId;

    /**
     * Venue ID
     */
    private Long venueId;

    /**
     * Event name
     */
    @NotBlank(message = "Event name is required")
    @Size(max = 150, message = "Event name cannot exceed 150 characters")
    private String name;

    /**
     * Event description
     */
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    /**
     * Event date
     */
    @NotNull(message = "Event date is required")
    private LocalDate date;
}