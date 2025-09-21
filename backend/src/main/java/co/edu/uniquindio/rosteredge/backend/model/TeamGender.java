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
 * TeamGender entity
 * Represents the different genders available for teams
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("TeamGender")
public class TeamGender extends BaseEntity {

    /**
     * Gender name
     */
    @NotBlank(message = "Gender name is required")
    @Size(max = 20, message = "Gender name cannot exceed 20 characters")
    private String name;
}