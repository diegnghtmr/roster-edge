package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

/**
 * User entity
 * Base entity for all users in the system
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("User")
public class User extends BaseEntity {

    /**
     * User email address
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 150, message = "Email cannot exceed 150 characters")
    private String email;

    /**
     * User password (hashed)
     */
    @NotBlank(message = "Password hash is required")
    @Size(max = 255, message = "Password hash cannot exceed 255 characters")
    private String passwordHash;

    /**
     * User first name
     */
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    /**
     * User last name
     */
    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name cannot exceed 100 characters")
    private String lastName;

    /**
     * City ID
     */
    @NotNull(message = "City ID is required")
    private Long cityId;

    /**
     * User phone number
     */
    @Size(max = 30, message = "Phone cannot exceed 30 characters")
    private String phone;

    /**
     * User birth date
     */
    @NotNull(message = "Birth date is required")
    private LocalDate birthDate;
}
