package co.edu.uniquindio.rosteredge.backend.dto.response.report;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Result payload for the staff-to-player ratio report.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TeamStaffRatioResponse {

    private Long teamId;
    private String teamName;
    private Long clubId;
    private String clubName;

    private Integer players;
    private Integer activePlayers;
    private Integer staff;
    private Integer activeStaff;

    private Double staffToPlayerRatio;
    private Double averageStaffTenure;

    private List<StaffRoleBreakdown> roleBreakdown;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StaffRoleBreakdown {
        private Long roleId;
        private String roleName;
        private Integer staffCount;
    }
}
