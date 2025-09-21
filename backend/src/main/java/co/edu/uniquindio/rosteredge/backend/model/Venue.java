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
 * Venue entity
 * Represents venues where events and trainings take place
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Venue")
public class Venue extends BaseEntity {

    /**
     * Venue email
     */
    @NotBlank(message = "Email is required")
    @Size(max = 150, message = "Email cannot exceed 150 characters")
    private String email;

    /**
     * City ID
     */
    @NotNull(message = "City ID is required")
    private Long cityId;

    /**
     * Venue foundation date
     */
    @NotNull(message = "Foundation date is required")
    private LocalDate foundation;

    /**
     * Venue name
     */
    @NotBlank(message = "Venue name is required")
    @Size(max = 150, message = "Venue name cannot exceed 150 characters")
    private String name;

    /**
     * Venue phone
     */
    @NotBlank(message = "Phone is required")
    @Size(max = 30, message = "Phone cannot exceed 30 characters")
    private String phone;

    /**
     * Club ID
     */
    @NotNull(message = "Club ID is required")
    private Long clubId;
}