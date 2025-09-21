package co.edu.uniquindio.rosteredge.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

/**
 * Base entity with common fields for all entities
 * Uses Spring Data JDBC annotations
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class BaseEntity {

    /**
     * Auto-generated unique identifier
     */
    @Id
    private Long id;

    /**
     * Record creation date and time
     */
    @CreatedDate
    private LocalDateTime createdAt;

    /**
     * Last update date and time
     */
    @LastModifiedDate
    private LocalDateTime updatedAt;

    /**
     * Indicates if the record is active (for soft delete)
     */
    private Boolean active = true;

    /**
     * Method to perform soft delete
     */
    public void softDelete() {
        this.active = false;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Method to restore a deleted record
     */
    public void restore() {
        this.active = true;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Pre-persist callback to set timestamps
     */
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
        if (this.active == null) {
            this.active = true;
        }
    }

    /**
     * Pre-update callback to update timestamp
     */
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
