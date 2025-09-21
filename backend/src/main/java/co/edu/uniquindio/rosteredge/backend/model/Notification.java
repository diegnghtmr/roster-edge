package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

/**
 * Notification entity
 * Represents notifications about specific club participations in events
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Notification")
public class Notification extends BaseEntity {

    /**
     * Notification message
     */
    @NotBlank(message = "Message is required")
    private String message;

    /**
     * Send date
     */
    private LocalDateTime sendDate;
}