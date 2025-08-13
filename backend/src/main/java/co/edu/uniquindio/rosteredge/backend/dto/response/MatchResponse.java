package co.edu.uniquindio.rosteredge.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for Match entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MatchResponse {
    
    private Long id;
    
    private Long homeTeamId;
    
    private Long awayTeamId;
    
    private String homeTeamName; // Team name for display
    
    private String awayTeamName; // Team name for display
    
    private LocalDateTime matchDate;
    
    private String venue;
    
    private String status; // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, POSTPONED
    
    private Integer homeScore;

    private Integer awayScore;
    
    private String scoreDisplay; // Computed field: "homeScore - awayScore"
    
    // Removed competition, season, notes, attendance, actualStartTime, endTime to align with DB schema
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private Boolean active;
    
    /**
     * Team summary for consistent display
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TeamSummary {
        private Long id;
        private String name;
        private String sport;
        private String shortName;
    }
    
    private TeamSummary homeTeam; // Optional: Include team summary if following patterns
    
    private TeamSummary awayTeam; // Optional: Include team summary if following patterns
    
    /**
     * Match result summary
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MatchResult {
        private String winner; // HOME, AWAY, DRAW, or null if not completed
        private Integer goalDifference;
        private Boolean isCompleted;
    }
    
    private MatchResult result; // Computed result information
}
