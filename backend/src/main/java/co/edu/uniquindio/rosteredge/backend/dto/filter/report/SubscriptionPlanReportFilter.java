package co.edu.uniquindio.rosteredge.backend.dto.filter.report;

import java.time.LocalDate;
import lombok.Data;

/**
 * Filters for the subscription plan performance analytics report.
 */
@Data
public class SubscriptionPlanReportFilter {

    private LocalDate fromDate;
    private LocalDate toDate;
    private Long planId;
    private Long statusId;
    private Integer renewalHorizonDays;
    private Integer churnWindowDays;
    private LocalDate referenceDate;
}

