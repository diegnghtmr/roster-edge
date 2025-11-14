package co.edu.uniquindio.rosteredge.backend.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * DTO for Match entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class MatchDTO extends BaseDTO {

    @NotNull(message = "Matchday ID is required")
    private Long matchdayId;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotNull(message = "Match date is required")
    private LocalDate date;

    @NotNull(message = "Stadium ID is required")
    private Long stadiumId;

    @NotNull(message = "Event ID is required")
    private Long eventId;

    // Additional fields for display purposes
    private String matchdayName;
    private String stadiumName;
    private String eventName;
    private String seasonName;
}
