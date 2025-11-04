package co.edu.uniquindio.rosteredge.backend.dto.response.report;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Result record for the subscription plan performance report.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubscriptionPlanPerformanceResponse {

    private Long planId;
    private String planName;
    private BigDecimal planPrice;

    private Integer totalSubscriptions;
    private Integer activeSubscriptions;
    private Integer trialSubscriptions;
    private Integer suspendedSubscriptions;
    private Integer inactiveSubscriptions;

    private Integer upcomingRenewals;
    private Integer churnedRecently;

    private Integer paymentsCount;
    private BigDecimal grossRevenue;
    private BigDecimal totalDiscount;
    private BigDecimal netRevenue;

    private BigDecimal averageRevenuePerSubscription;
    private BigDecimal arpu;
    private Double retentionRatePercentage;
}

