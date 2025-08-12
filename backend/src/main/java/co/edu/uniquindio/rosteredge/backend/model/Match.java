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
     * Match date and time
     */
    @NotNull(message = "Match date is required")
    @Future(message = "Match date must be in the future for new matches")
    private LocalDateTime matchDate;
    
    /**
     * Home team score
     */
    @Min(value = 0, message = "Score cannot be negative")
    private Integer homeScore = 0;
    
    /**
     * Away team score
     */
    @Min(value = 0, message = "Score cannot be negative")
    private Integer awayScore = 0;
    
    /**
     * Match status (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
     */
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(SCHEDULED|IN_PROGRESS|COMPLETED|CANCELLED)$", message = "Invalid status")
    private String status = "SCHEDULED";
    
    /**
     * Match venue
     */
    @Size(max = 200, message = "Venue cannot exceed 200 characters")
    private String venue;
}
