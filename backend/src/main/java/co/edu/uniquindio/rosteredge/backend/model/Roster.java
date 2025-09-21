package co.edu.uniquindio.rosteredge.backend.model;

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
 * Roster entity
 * Represents team management system with subscriptions
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Roster")
public class Roster extends BaseEntity {

    /**
     * Roster name
     */
    @NotBlank(message = "Roster name is required")
    @Size(max = 50, message = "Roster name cannot exceed 50 characters")
    private String name;

    /**
     * Roster email
     */
    @NotBlank(message = "Email is required")
    @Size(max = 50, message = "Email cannot exceed 50 characters")
    private String email;

    /**
     * Password hash
     */
    @NotBlank(message = "Password hash is required")
    @Size(max = 255, message = "Password hash cannot exceed 255 characters")
    private String passwordHash;

    /**
     * Creation date
     */
    private LocalDate creationDate;

    /**
     * Last access date
     */
    private LocalDate lastAccess;

    /**
     * Club ID
     */
    @NotNull(message = "Club ID is required")
    private Long clubId;

    /**
     * Subscription ID
     */
    @NotNull(message = "Subscription ID is required")
    private Long subscriptionId;
}