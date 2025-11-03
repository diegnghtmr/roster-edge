package co.edu.uniquindio.rosteredge.backend.dto.filter.report;

import java.time.LocalDate;
import lombok.Data;

/**
 * Filters used by the season agenda report.
 */
@Data
public class SeasonAgendaReportFilter {

    private Long clubId;
    private Long seasonId;
    private LocalDate fromDate;
    private LocalDate toDate;

    /**
     * Number of future days to include when no explicit range is supplied.
     */
    private Integer horizonDays;
}
