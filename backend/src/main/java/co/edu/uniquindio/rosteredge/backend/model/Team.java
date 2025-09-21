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
 * Team entity
 * Represents teams in a club
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Team")
public class Team extends BaseEntity {

    /**
     * Team name
     */
    @NotBlank(message = "Team name is required")
    @Size(max = 120, message = "Team name cannot exceed 120 characters")
    private String name;

    /**
     * Team gender ID
     */
    @NotNull(message = "Gender ID is required")
    private Long genderId;

    /**
     * Team category ID
     */
    @NotNull(message = "Category ID is required")
    private Long categoryId;

    /**
     * Team mascot
     */
    @Size(max = 100, message = "Mascot cannot exceed 100 characters")
    private String mascot;

    /**
     * Team foundation date
     */
    @NotNull(message = "Foundation date is required")
    private LocalDate foundation;

    /**
     * Club ID
     */
    @NotNull(message = "Club ID is required")
    private Long clubId;
}
