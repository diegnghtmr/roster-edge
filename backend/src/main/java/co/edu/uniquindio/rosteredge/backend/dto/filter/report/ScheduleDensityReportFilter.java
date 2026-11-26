package co.edu.uniquindio.rosteredge.backend.dto.filter.report;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Data;

/**
 * Filters for the schedule congestion analysis report.
 */
@Data
public class ScheduleDensityReportFilter {

    @NotNull(message = "Club ID is required")
    private Long clubId;
    private Long seasonId;
    private Long teamId;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Integer alertThresholdDays;
}
