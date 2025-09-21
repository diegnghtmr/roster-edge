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
 * PlayerPosition entity
 * Represents the different positions available for football players
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("PlayerPosition")
public class PlayerPosition extends BaseEntity {

    /**
     * Position name
     */
    @NotBlank(message = "Position name is required")
    @Size(max = 100, message = "Position name cannot exceed 100 characters")
    private String name;
}