package co.edu.uniquindio.rosteredge.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

/**
 * DTO for Match entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class MatchDTO extends BaseDTO {
    
    @NotNull(message = "Home team is required")
    private Long homeTeamId;
    
    @NotNull(message = "Away team is required")
    private Long awayTeamId;
    
    @NotNull(message = "Match date is required")
    private LocalDateTime matchDate;
    
    @Min(value = 0, message = "Score cannot be negative")
    @Builder.Default
    private Integer homeScore = 0;
    
    @Min(value = 0, message = "Score cannot be negative")
    @Builder.Default
    private Integer awayScore = 0;
    
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(SCHEDULED|IN_PROGRESS|COMPLETED|CANCELLED)$", message = "Invalid status")
    @Builder.Default
    private String status = "SCHEDULED";
    
    @Size(max = 200, message = "Venue cannot exceed 200 characters")
    private String venue;
    
    // Additional fields for team names in responses
    private String homeTeamName;
    private String awayTeamName;
}
