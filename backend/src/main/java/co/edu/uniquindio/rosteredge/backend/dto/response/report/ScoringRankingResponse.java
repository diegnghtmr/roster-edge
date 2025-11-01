package co.edu.uniquindio.rosteredge.backend.dto.response.report;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Result representation for the seasonal scoring ranking report.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ScoringRankingResponse {

    private Long seasonId;
    private String seasonName;

    private Long teamId;
    private String teamName;
    private Long clubId;
    private String clubName;

    private Integer matchesPlayed;
    private Integer goalsFor;
    private Integer goalsAgainst;
    private Integer goalDifference;
    private Double goalsPerMatch;
    private Double goalsAgainstPerMatch;
}
