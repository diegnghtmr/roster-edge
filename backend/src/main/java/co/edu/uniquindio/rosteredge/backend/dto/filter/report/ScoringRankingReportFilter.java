package co.edu.uniquindio.rosteredge.backend.dto.filter.report;

import lombok.Data;

/**
 * Filters for the seasonal scoring ranking report.
 */
@Data
public class ScoringRankingReportFilter {

    private Long clubId;
    private Long seasonId;
}
