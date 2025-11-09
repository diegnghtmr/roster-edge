package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

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


}
