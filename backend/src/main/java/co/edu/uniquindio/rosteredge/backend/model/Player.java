package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

/**
 * Player entity
 * Represents players registered with primary position
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Player")
public class Player extends User {

    /**
     * Physical state ID
     */
    @NotNull(message = "Physical state ID is required")
    private Long physicalStateId;

    /**
     * Jersey number
     */
    @NotBlank(message = "Jersey number is required")
    @Size(max = 30, message = "Jersey number cannot exceed 30 characters")
    private String jerseyNumber;

    /**
     * Player height
     */
    @NotBlank(message = "Height is required")
    @Size(max = 4, message = "Height cannot exceed 4 characters")
    private String height;

    /**
     * Dominant foot
     */
    @NotBlank(message = "Dominant foot is required")
    @Size(max = 30, message = "Dominant foot cannot exceed 30 characters")
    private String dominantFoot;

    /**
     * Player weight
     */
    @NotBlank(message = "Weight is required")
    @Size(max = 10, message = "Weight cannot exceed 10 characters")
    private String weight;

    /**
     * Primary position ID
     */
    @NotNull(message = "Primary position ID is required")
    private Long primaryPositionId;

    /**
     * Team ID
     */
    @NotNull(message = "Team ID is required")
    private Long teamId;
}
