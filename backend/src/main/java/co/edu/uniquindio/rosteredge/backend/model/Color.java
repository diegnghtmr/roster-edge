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
 * Color entity
 * Represents colors used by teams
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Color")
public class Color extends BaseEntity {

    /**
     * Color name
     */
    @NotBlank(message = "Color name is required")
    @Size(max = 50, message = "Color name cannot exceed 50 characters")
    private String name;
}