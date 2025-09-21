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
 * Currency entity
 * Represents the different currencies available
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Currency")
public class Currency extends BaseEntity {

    /**
     * Currency name
     */
    @NotBlank(message = "Currency name is required")
    @Size(max = 50, message = "Currency name cannot exceed 50 characters")
    private String name;

    /**
     * Currency symbol
     */
    @NotBlank(message = "Currency symbol is required")
    @Size(max = 10, message = "Currency symbol cannot exceed 10 characters")
    private String symbol;
}