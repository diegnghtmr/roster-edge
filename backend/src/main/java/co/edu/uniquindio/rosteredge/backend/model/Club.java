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
 * Club entity
 * Represents sports clubs managed in the platform
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Club")
public class Club extends BaseEntity {

    /**
     * Club name
     */
    @NotBlank(message = "Club name is required")
    @Size(max = 150, message = "Club name cannot exceed 150 characters")
    private String name;

    /**
     * Club motto
     */
    @Size(max = 500, message = "Motto cannot exceed 500 characters")
    private String motto;

    /**
     * Club foundation date
     */
    @NotNull(message = "Foundation date is required")
    private LocalDate foundation;
}