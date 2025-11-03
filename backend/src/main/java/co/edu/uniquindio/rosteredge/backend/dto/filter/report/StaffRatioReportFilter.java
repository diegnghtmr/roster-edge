package co.edu.uniquindio.rosteredge.backend.dto.filter.report;

import lombok.Data;

/**
 * Filters for the staff-to-player ratio report.
 */
@Data
public class StaffRatioReportFilter {

    private Long clubId;
    private Long teamId;
}
