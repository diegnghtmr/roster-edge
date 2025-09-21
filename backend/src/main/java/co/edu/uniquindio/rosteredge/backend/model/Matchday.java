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
 * Matchday entity
 * Represents the different matchdays in a competition
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Matchday")
public class Matchday extends BaseEntity {

    /**
     * Matchday name
     */
    @NotBlank(message = "Matchday name is required")
    @Size(max = 100, message = "Matchday name cannot exceed 100 characters")
    private String name;

    /**
     * Matchday description
     */
    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;
}