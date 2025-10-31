package co.edu.uniquindio.rosteredge.backend.dto.filter.report;

import lombok.Data;

/**
 * Filters for the season standings table report.
 */
@Data
public class SeasonStandingsReportFilter {

    private Long seasonId;
    private Long clubId;
}
