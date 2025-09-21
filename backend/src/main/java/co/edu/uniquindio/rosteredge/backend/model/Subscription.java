package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

/**
 * Subscription entity
 * Represents user subscriptions
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Subscription")
public class Subscription extends BaseEntity {

    /**
     * Plan ID
     */
    @NotNull(message = "Plan ID is required")
    private Long planId;

    /**
     * Start date
     */
    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    /**
     * End date
     */
    @NotNull(message = "End date is required")
    private LocalDate endDate;

    /**
     * Status ID
     */
    @NotNull(message = "Status ID is required")
    private Long statusId;
}