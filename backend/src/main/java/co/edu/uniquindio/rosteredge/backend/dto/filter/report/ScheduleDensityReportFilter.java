package co.edu.uniquindio.rosteredge.backend.dto.filter.report;

import java.time.LocalDate;
import lombok.Data;

/**
 * Filters for the schedule congestion analysis report.
 */
@Data
public class ScheduleDensityReportFilter {

    private Long seasonId;
    private Long teamId;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Integer alertThresholdDays;
}
