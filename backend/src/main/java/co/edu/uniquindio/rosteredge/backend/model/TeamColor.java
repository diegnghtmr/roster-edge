package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

/**
 * TeamColor entity
 * Represents the relationship between teams and their colors
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("TeamColor")
public class TeamColor extends BaseEntity {

    /**
     * Team ID
     */
    @NotNull(message = "Team ID is required")
    private Long teamId;

    /**
     * Color ID
     */
    @NotNull(message = "Color ID is required")
    private Long colorId;
}