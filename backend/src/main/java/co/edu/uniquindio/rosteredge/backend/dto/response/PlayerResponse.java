package co.edu.uniquindio.rosteredge.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO for Player entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlayerResponse {
    
    private Long id;
    
    private String firstName;
    
    private String lastName;
    
    private String fullName; // Computed field: firstName + " " + lastName
    
    private Long teamId;
    
    private String teamName; // Team name for display purposes
    
    private String position;
    
    private Integer jerseyNumber;
    
    private Boolean active;
    
    private LocalDate dateOfBirth;
    
    private Integer age; // Computed field based on dateOfBirth
    
    private String nationality;
    
    // Removed height & weight to align with DB schema
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
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
    }
    
    private TeamSummary team; // Optional: Include team summary if following TeamController pattern
}
