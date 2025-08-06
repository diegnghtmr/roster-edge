package co.edu.uniquindio.rosteredge.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

/**
 * Base DTO with common fields for all DTOs
 * Uses Lombok to generate getters, setters, constructors, etc.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class BaseDTO {
    
    /**
     * Unique record identifier
     */
    private Long id;
    
    /**
     * Record creation date and time
     */
    private LocalDateTime createdAt;
    
    /**
     * Last update date and time
     */
    private LocalDateTime updatedAt;
    
    /**
     * Indicates if the record is active (soft delete)
     */
    private Boolean active;
}
