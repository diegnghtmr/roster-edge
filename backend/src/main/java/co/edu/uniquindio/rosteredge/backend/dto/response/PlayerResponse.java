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

    private String email;

    private String name;

    private String lastName;

    private String fullName; // Computed field: name + " " + lastName

    private Long cityId;

    private String cityName;

    private String phone;

    private LocalDate birthDate;

    private Integer age; // Computed field based on birthDate

    private Long physicalStateId;

    private String physicalStateName;

    private String jerseyNumber;

    private String height;

    private String dominantFoot;

    private String weight;

    private Long primaryPositionId;

    private String primaryPositionName;

    private Long teamId;

    private String teamName;

    private Boolean active;

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
    }

    private TeamSummary team;
}
