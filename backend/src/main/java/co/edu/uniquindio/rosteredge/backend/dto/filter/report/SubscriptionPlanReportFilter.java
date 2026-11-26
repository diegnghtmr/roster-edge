package co.edu.uniquindio.rosteredge.backend.dto.filter.report;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Data;

/**
 * Filters for the subscription plan performance analytics report.
 */
@Data
public class SubscriptionPlanReportFilter {

    @NotNull(message = "Club ID is required")
    private Long clubId;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Long planId;
    private Long statusId;
    private Integer renewalHorizonDays;
    private Integer churnWindowDays;
    private LocalDate referenceDate;
}

