package co.edu.uniquindio.rosteredge.backend.dto.filter.report;

import lombok.Data;

/**
 * Filters for the staff-impact performance report.
 */
@Data
public class StaffImpactReportFilter {

    private Long clubId;
    private Long seasonId;
}
