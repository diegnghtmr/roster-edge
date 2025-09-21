package co.edu.uniquindio.rosteredge.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;

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

    @NotNull(message = "Season ID is required")
    private Long seasonId;

    // Additional fields for display purposes
    private String matchdayName;
    private String stadiumName;
    private String seasonName;
}
