package co.edu.uniquindio.rosteredge.backend.dto.filter;

import java.time.LocalDate;
import lombok.Data;

/**
 * Query parameters for the subscription coverage endpoint.
 */
@Data
public class SubscriptionCoverageFilter {

    private Long clubId;
    private Long planId;
    private Long statusId;
    private Boolean active;
    private String search;
    private LocalDate expiresBefore;
    private LocalDate expiresAfter;
    private Integer expiringInDays;
    private LocalDate lastAccessBefore;
    private LocalDate lastAccessAfter;
}
