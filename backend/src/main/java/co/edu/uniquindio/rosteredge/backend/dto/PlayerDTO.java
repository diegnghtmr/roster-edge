package co.edu.uniquindio.rosteredge.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

/**
 * DTO for Player entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class PlayerDTO extends BaseDTO {
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;
    
    @Min(value = 0, message = "Jersey number cannot be negative")
    @Max(value = 999, message = "Jersey number cannot exceed 999")
    private Integer jerseyNumber;
    
    @Size(max = 50, message = "Position cannot exceed 50 characters")
    private String position;
    
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;
    
    @Size(max = 50, message = "Nationality cannot exceed 50 characters")
    private String nationality;
    
    private Long teamId;
    
    // Additional field for team name in responses
    private String teamName;
}
