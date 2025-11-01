package co.edu.uniquindio.rosteredge.backend.dto.filter.report;

import lombok.Data;

/**
 * Filters used by the match load (home/away) report.
 */
@Data
public class MatchLoadReportFilter {

    private Long clubId;
    private Long seasonId;
    private Long teamId;
}
