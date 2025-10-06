package co.edu.uniquindio.rosteredge.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Projection produced by the subscription coverage endpoint.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubscriptionCoverageResponse {

    private Long rosterId;
    private String rosterName;
    private String rosterEmail;
    private Boolean rosterActive;
    private LocalDate creationDate;
    private LocalDate lastAccess;

    private Long clubId;
    private String clubName;

    private Long subscriptionId;
    private LocalDate startDate;
    private LocalDate endDate;

    private Long planId;
    private String planName;
    private String planDescription;
    private BigDecimal planPrice;

    private Long statusId;
    private String statusName;

    private Integer daysRemaining;
    private Boolean expired;
    private Integer benefitCount;
}
