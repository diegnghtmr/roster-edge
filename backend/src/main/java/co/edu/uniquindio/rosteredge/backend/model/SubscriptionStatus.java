package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

/**
 * SubscriptionStatus entity
 * Represents the different statuses available for subscriptions
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("SubscriptionStatus")
public class SubscriptionStatus extends BaseEntity {

    /**
     * Status name
     */
    @NotBlank(message = "Status name is required")
    @Size(max = 50, message = "Status name cannot exceed 50 characters")
    private String name;
}