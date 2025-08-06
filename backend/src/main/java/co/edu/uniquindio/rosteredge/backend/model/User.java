package co.edu.uniquindio.rosteredge.backend.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

/**
 * Example User entity
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
    private String username;
    
    /**
     * User email address
     */
    private String email;
    
    /**
     * User full name
     */
    private String fullName;
    
    /**
     * User role in the system
     */
    private String role;
    
    /**
     * User status (ACTIVE, INACTIVE, SUSPENDED)
     */
    private String status;
}
