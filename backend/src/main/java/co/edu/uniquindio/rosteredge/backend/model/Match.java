package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

/**
 * Match entity
 * Represents a match between two teams
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("matches")
public class Match extends BaseEntity {
    
    /**
     * Home team ID
     */
    @NotNull(message = "Home team is required")
    private Long homeTeamId;
    
    /**
     * Away team ID
     */
    @NotNull(message = "Away team is required")
    private Long awayTeamId;
    
    /**
     * Date & time of the match (was previously named startTime)
     */
    @NotNull(message = "Match date is required")
    @FutureOrPresent(message = "Match date must be in the future or present")
    private LocalDateTime matchDate;
    
    /**
     * Home score
     */
    @Min(value = 0, message = "Score cannot be negative")
    @lombok.Builder.Default
    private Integer homeScore = 0;

    /**
     * Away score
     */
    @Min(value = 0, message = "Score cannot be negative")
    @lombok.Builder.Default
    private Integer awayScore = 0;
    
    /**
     * Match status (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, POSTPONED)
     */
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(SCHEDULED|IN_PROGRESS|COMPLETED|CANCELLED)$", message = "Invalid status")
    @lombok.Builder.Default
    private String status = "SCHEDULED";
    
    /**
     * Match venue
     */
    @Size(max = 200, message = "Venue cannot exceed 200 characters")
    private String venue;
    
    // Removed fields (competition, season, notes, attendance, startTime, scoreHome/scoreAway duplicates, actualStartTime, endTime)
    // to align with current database schema.
}
