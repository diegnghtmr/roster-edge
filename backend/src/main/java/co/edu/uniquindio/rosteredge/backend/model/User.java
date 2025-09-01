package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

/**
 * User entity
 * Represents a user in the system
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("users")
public class User extends BaseEntity {
    
    /**
     * Unique username
     */
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers and underscores")
    private String username;
    
    /**
     * User email address
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;
    
    /**
     * User password (hashed)
     */
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    /**
     * User full name
     */
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    private String fullName;
    
    /**
     * User role in the system
     */
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(ADMIN|COACH|PLAYER|VIEWER)$", message = "Invalid role")
    private String role;
    
    /**
     * User status (ACTIVE, INACTIVE, SUSPENDED)
     */
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(ACTIVE|INACTIVE|SUSPENDED)$", message = "Invalid status")
    private String status;
    
    /**
     * Authentication token for simple auth
     */
    private String authToken;

    public String getRole() {
        return role;
    }
}
