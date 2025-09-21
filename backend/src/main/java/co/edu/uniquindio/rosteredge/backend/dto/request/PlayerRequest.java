package co.edu.uniquindio.rosteredge.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Request DTO for creating and updating Player entities
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerRequest {

    @NotBlank(message = "Email is required")
    @Size(max = 150, message = "Email cannot exceed 150 characters")
    private String email;

    @NotBlank(message = "Password hash is required")
    @Size(max = 255, message = "Password hash cannot exceed 255 characters")
    private String passwordHash;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name cannot exceed 100 characters")
    private String lastName;

    @NotNull(message = "City ID is required")
    private Long cityId;

    @Size(max = 30, message = "Phone cannot exceed 30 characters")
    private String phone;

    @NotNull(message = "Birth date is required")
    private LocalDate birthDate;

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

    @NotNull(message = "Active status is required")
    private Boolean active;
}
