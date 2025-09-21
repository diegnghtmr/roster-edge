package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Match entity
 * Represents specific match information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Match")
public class Match extends BaseEntity {

    /**
     * Matchday ID
     */
    @NotNull(message = "Matchday ID is required")
    private Long matchdayId;

    /**
     * Start time
     */
    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    /**
     * End time
     */
    @NotNull(message = "End time is required")
    private LocalTime endTime;

    /**
     * Match date
     */
    @NotNull(message = "Match date is required")
    private LocalDate date;

    /**
     * Stadium ID
     */
    @NotNull(message = "Stadium ID is required")
    private Long stadiumId;

    /**
     * Season ID
     */
    @NotNull(message = "Season ID is required")
    private Long seasonId;
}
