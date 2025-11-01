package co.edu.uniquindio.rosteredge.backend.dto.response.report;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Result object for the schedule congestion analysis.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ScheduleDensityResponse {

    private Long teamId;
    private String teamName;
    private Long seasonId;
    private String seasonName;

    private Long matchId;
    private LocalDate matchDate;
    private Integer restDays;
    private Integer matchesLastSevenDays;
    private Integer matchesNextSevenDays;
    private Integer matchDurationMinutes;
    private Boolean belowRestThreshold;
}
