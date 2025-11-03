package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Payment entity
 * Represents payment records with transactional information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Payment")
public class Payment extends BaseEntity {

    /**
     * Payment date
     */
    private LocalDateTime paymentDate;

    /**
     * Payment method ID
     */
    @NotNull(message = "Payment method ID is required")
    private Long paymentMethodId;

    /**
     * Payment description
     */
    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    /**
     * Payment amount
     */
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", message = "Amount cannot be negative")
    @DecimalMax(value = "10000000.0", message = "Amount cannot exceed 10,000,000")
    private BigDecimal amount;

    /**
     * Payment discount
     */
    @DecimalMin(value = "0.0", message = "Discount cannot be negative")
    @DecimalMax(value = "100.0", message = "Discount cannot exceed 100%")
    @lombok.Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    /**
     * Currency ID
     */
    @NotNull(message = "Currency ID is required")
    private Long currencyId;

    /**
     * Plan ID
     */
    @NotNull(message = "Plan ID is required")
    private Long planId;

    /**
     * Roster ID
     */
    @NotNull(message = "Roster ID is required")
    private Long rosterId;
}
