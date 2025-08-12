package co.edu.uniquindio.rosteredge.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * DTO for Team entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class TeamDTO extends BaseDTO {
    
    @NotBlank(message = "Team name is required")
    @Size(min = 2, max = 100, message = "Team name must be between 2 and 100 characters")
    private String name;
    
    @Size(max = 50, message = "Sport cannot exceed 50 characters")
    private String sport;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    @Min(value = 1800, message = "Founded year must be after 1800")
    @Max(value = 2100, message = "Founded year cannot be in the far future")
    private Integer foundedYear;
}
