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
 * PhysicalState entity
 * Represents the different physical states available for players
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("PhysicalState")
public class PhysicalState extends BaseEntity {

    /**
     * Physical state name
     */
    @NotBlank(message = "Physical state name is required")
    @Size(max = 50, message = "Physical state name cannot exceed 50 characters")
    private String name;
}