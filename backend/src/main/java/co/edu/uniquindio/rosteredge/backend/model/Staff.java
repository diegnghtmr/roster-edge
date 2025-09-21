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
 * Staff entity
 * Represents technical staff with specific roles
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Staff")
public class Staff extends User {

    /**
     * Hire date
     */
    private LocalDate hireDate;

    /**
     * Staff role ID
     */
    @NotNull(message = "Staff role ID is required")
    private Long staffRoleId;

    /**
     * Team ID
     */
    @NotNull(message = "Team ID is required")
    private Long teamId;
}