package co.edu.uniquindio.rosteredge.backend.dto.response.report;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Result structure for the seasonal standings table.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SeasonStandingResponse {

    private Long seasonId;
    private String seasonName;

    private Long teamId;
    private String teamName;
    private Long clubId;
    private String clubName;

    private Integer played;
    private Integer wins;
    private Integer draws;
    private Integer losses;
    private Integer goalsFor;
    private Integer goalsAgainst;
    private Integer goalDifference;
    private Integer points;
    private Double winRate;
    private Double pointsPerMatch;
    private Integer rankingPosition;
}
