package co.edu.uniquindio.rosteredge.backend.dto.filter.report;

import java.time.LocalDate;
import lombok.Data;

/**
 * Filters for the payment method performance analytics report.
 */
@Data
public class PaymentMethodReportFilter {

    private LocalDate fromDate;
    private LocalDate toDate;
    private Long planId;
    private Long currencyId;
}

