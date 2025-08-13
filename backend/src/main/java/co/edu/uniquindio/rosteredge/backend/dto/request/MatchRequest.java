package co.edu.uniquindio.rosteredge.backend.dto.request;

import co.edu.uniquindio.rosteredge.backend.validation.DifferentTeams;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Request DTO for creating and updating Match entities
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DifferentTeams
public class MatchRequest {
    
    @NotNull(message = "Home team ID is required")
    @Positive(message = "Home team ID must be a positive number")
    private Long homeTeamId;
    
    @NotNull(message = "Away team ID is required")
    @Positive(message = "Away team ID must be a positive number")
    private Long awayTeamId;
    
    @NotNull(message = "Match date is required")
    @FutureOrPresent(message = "Match date must be in the future or present")
    private LocalDateTime matchDate;
    
    @NotBlank(message = "Venue is required")
    @Size(min = 2, max = 200, message = "Venue must be between 2 and 200 characters")
    private String venue;
    
    @Pattern(regexp = "^(SCHEDULED|IN_PROGRESS|COMPLETED|CANCELLED)$", 
            message = "Status must be one of: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED")
    private String status;
    
    @Min(value = 0, message = "Home score cannot be negative")
    @Max(value = 999, message = "Home score cannot exceed 999")
    private Integer homeScore;
    
    @Min(value = 0, message = "Away score cannot be negative")
    @Max(value = 999, message = "Away score cannot exceed 999")
    private Integer awayScore;
    
    // Removed fields (competition, season, notes, attendance, actualStartTime, endTime) to align with current DB schema
}
