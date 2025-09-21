package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;

/**
 * Plan entity
 * Represents subscription plans
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Plan")
public class Plan extends BaseEntity {

    /**
     * Plan name
     */
    @NotBlank(message = "Plan name is required")
    @Size(max = 80, message = "Plan name cannot exceed 80 characters")
    private String name;

    /**
     * Plan description
     */
    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    /**
     * Plan price
     */
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", message = "Price cannot be negative")
    private BigDecimal price;
}