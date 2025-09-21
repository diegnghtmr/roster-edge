package co.edu.uniquindio.rosteredge.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * DTO for Player entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class PlayerDTO extends UserDTO {

    @NotNull(message = "Physical state ID is required")
    private Long physicalStateId;

    @NotBlank(message = "Jersey number is required")
    @Size(max = 30, message = "Jersey number cannot exceed 30 characters")
    private String jerseyNumber;

    @NotBlank(message = "Height is required")
    @Size(max = 4, message = "Height cannot exceed 4 characters")
    private String height;

    @NotBlank(message = "Dominant foot is required")
    @Size(max = 30, message = "Dominant foot cannot exceed 30 characters")
    private String dominantFoot;

    @NotBlank(message = "Weight is required")
    @Size(max = 10, message = "Weight cannot exceed 10 characters")
    private String weight;

    @NotNull(message = "Primary position ID is required")
    private Long primaryPositionId;

    @NotNull(message = "Team ID is required")
    private Long teamId;

    // Additional fields for display purposes
    private String physicalStateName;
    private String primaryPositionName;
    private String teamName;
}
