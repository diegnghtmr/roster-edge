package co.edu.uniquindio.rosteredge.backend.dto.request;

import jakarta.validation.constraints.*;
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
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;
    
    @NotNull(message = "Team ID is required")
    @Positive(message = "Team ID must be a positive number")
    private Long teamId;
    
    @Size(max = 50, message = "Position cannot exceed 50 characters")
    private String position;
    
    @Positive(message = "Jersey number must be a positive number")
    @Max(value = 999, message = "Jersey number cannot exceed 999")
    private Integer jerseyNumber;
    
    @NotNull(message = "Active status is required")
    private Boolean active;
    
    @Past(message = "Date of birth must be in the past")
    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;
    
    @Size(max = 50, message = "Nationality cannot exceed 50 characters")
    private String nationality;
    
    // Removed height & weight (not present in current DB schema)
}
