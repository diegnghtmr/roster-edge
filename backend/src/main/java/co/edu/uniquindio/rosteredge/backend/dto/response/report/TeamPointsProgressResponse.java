package co.edu.uniquindio.rosteredge.backend.dto.response.report;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entry returned by the cumulative points per match report.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TeamPointsProgressResponse {

    private Long seasonId;
    private String seasonName;

    private Long teamId;
    private String teamName;

    private Long matchId;
    private LocalDate matchDate;
    private Long matchdayId;
    private String matchdayName;

    private Integer matchNumber;
    private Integer pointsEarned;
    private Integer cumulativePoints;
    private Integer goalsFor;
    private Integer goalsAgainst;
    private Integer goalDifference;
}
