package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

/**
 * Team entity
 * Represents a sports team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("teams")
public class Team extends BaseEntity {
    
    /**
     * Team name
     */
    @NotBlank(message = "Team name is required")
    @Size(min = 2, max = 100, message = "Team name must be between 2 and 100 characters")
    private String name;
    
    /**
     * Sport type
     */
    @Size(max = 50, message = "Sport cannot exceed 50 characters")
    private String sport;
    
    /**
     * Team description
     */
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    /**
     * Year the team was founded
     */
    @Min(value = 1800, message = "Founded year must be after 1800")
    @Max(value = 2100, message = "Founded year cannot be in the far future")
    private Integer foundedYear;
}
