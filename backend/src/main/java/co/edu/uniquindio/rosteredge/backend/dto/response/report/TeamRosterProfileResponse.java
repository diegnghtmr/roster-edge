package co.edu.uniquindio.rosteredge.backend.dto.response.report;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Result container for the roster profile report per team.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TeamRosterProfileResponse {

    private Long teamId;
    private String teamName;
    private Long clubId;
    private String clubName;
    private Integer totalPlayers;
    private Integer activePlayers;
    private Double averageAge;
    private List<PhysicalStateBreakdown> physicalStates;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PhysicalStateBreakdown {
        private Long physicalStateId;
        private String physicalStateName;
        private Integer players;
    }
}
