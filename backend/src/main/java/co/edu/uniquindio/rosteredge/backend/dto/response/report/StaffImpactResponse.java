package co.edu.uniquindio.rosteredge.backend.dto.response.report;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Result payload for the staff-to-performance impact analysis.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StaffImpactResponse {

    private Double ratioWinRateCorrelation;
    private Double ratioPointsCorrelation;
    private Double averageStaffRatio;
    private Double averagePlayerAge;
    private List<TeamStaffImpactDetail> teamDetails;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TeamStaffImpactDetail {
        private Long teamId;
        private String teamName;
        private Long clubId;
        private String clubName;
        private Long seasonId;
        private String seasonName;
        private Double staffToPlayerRatio;
        private Double averagePlayerAge;
        private Double averageStaffTenure;
        private Double winRate;
        private Double pointsPerMatch;
        private Integer goalDifference;
        private Integer matchesPlayed;
    }
}
