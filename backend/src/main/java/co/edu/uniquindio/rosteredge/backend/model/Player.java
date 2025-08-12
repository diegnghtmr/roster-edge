package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

/**
 * Player entity
 * Represents a player in a team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("players")
public class Player extends BaseEntity {
    
    /**
     * Player's first name
     */
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;
    
    /**
     * Player's last name
     */
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;
    
    /**
     * Jersey number
     */
    @Min(value = 0, message = "Jersey number cannot be negative")
    @Max(value = 999, message = "Jersey number cannot exceed 999")
    private Integer jerseyNumber;
    
    /**
     * Player position
     */
    @Size(max = 50, message = "Position cannot exceed 50 characters")
    private String position;
    
    /**
     * Date of birth
     */
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;
    
    /**
     * Player nationality
     */
    @Size(max = 50, message = "Nationality cannot exceed 50 characters")
    private String nationality;
    
    /**
     * Team ID
     */
    private Long teamId;
}
