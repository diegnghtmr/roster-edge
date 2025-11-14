package co.edu.uniquindio.rosteredge.backend.dto.response.report;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Result record for the payment method performance report.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentMethodPerformanceResponse {

    private Long paymentMethodId;
    private String paymentMethodName;
    private Long totalPayments;
    private Long uniqueCustomers;
    private Integer plansCovered;

    private BigDecimal grossAmount;
    private BigDecimal totalDiscount;
    private BigDecimal netRevenue;
    private BigDecimal averageTicket;

    private Double revenueSharePercentage;
    private Double discountRatePercentage;

    private LocalDateTime firstPaymentDate;
    private LocalDateTime lastPaymentDate;
}

