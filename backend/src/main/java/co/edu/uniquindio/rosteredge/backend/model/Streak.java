package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

/**
 * Streak entity
 * Represents team streaks
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Streak")
public class Streak extends BaseEntity {

    /**
     * Team ID
     */
    @NotNull(message = "Team ID is required")
    private Long teamId;

    /**
     * Start date
     */
    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    /**
     * End date
     */
    private LocalDate endDate;
}