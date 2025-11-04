package co.edu.uniquindio.rosteredge.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating and updating Match entities
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchRequest {

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

    @NotNull(message = "Active status is required")
    private Boolean active;
}
