package co.edu.uniquindio.rosteredge.backend.dto.response.report;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response record for the home/away match load report.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TeamMatchLoadResponse {

    private Long seasonId;
    private String seasonName;

    private Long teamId;
    private String teamName;
    private Long clubId;
    private String clubName;

    private Integer homeMatches;
    private Integer awayMatches;
    private Integer totalMatches;
}
