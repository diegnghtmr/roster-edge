package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

/**
 * PaymentMethod entity
 * Represents the different payment methods available
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("PaymentMethod")
public class PaymentMethod extends BaseEntity {

    /**
     * Payment method name
     */
    @NotBlank(message = "Payment method name is required")
    @Size(max = 80, message = "Payment method name cannot exceed 80 characters")
    private String name;
}