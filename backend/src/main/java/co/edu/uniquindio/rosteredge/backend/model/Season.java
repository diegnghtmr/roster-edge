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
 * Season entity
 * Represents sports seasons per club
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Season")
public class Season extends BaseEntity {

    /**
     * Club ID
     */
    @NotNull(message = "Club ID is required")
    private Long clubId;

    /**
     * Season name
     */
    @NotBlank(message = "Season name is required")
    @Size(max = 100, message = "Season name cannot exceed 100 characters")
    private String name;

    /**
     * Season start date
     */
    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    /**
     * Season end date
     */
    @NotNull(message = "End date is required")
    private LocalDate endDate;
}