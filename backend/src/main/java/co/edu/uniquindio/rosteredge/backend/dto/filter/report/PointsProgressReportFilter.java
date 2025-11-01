package co.edu.uniquindio.rosteredge.backend.dto.filter.report;

import lombok.Data;

/**
 * Filters for the cumulative points per matchday report.
 */
@Data
public class PointsProgressReportFilter {

    private Long seasonId;
    private Long teamId;
}
