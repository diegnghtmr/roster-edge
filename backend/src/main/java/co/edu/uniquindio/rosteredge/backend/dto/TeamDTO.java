package co.edu.uniquindio.rosteredge.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

/**
 * DTO for Team entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class TeamDTO extends BaseDTO {

    @NotBlank(message = "Team name is required")
    @Size(max = 120, message = "Team name cannot exceed 120 characters")
    private String name;

    @NotNull(message = "Gender ID is required")
    private Long genderId;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @Size(max = 100, message = "Mascot cannot exceed 100 characters")
    private String mascot;

    @NotNull(message = "Foundation date is required")
    private LocalDate foundation;

    @NotNull(message = "Club ID is required")
    private Long clubId;

    // Additional fields for display purposes
    private String genderName;
    private String categoryName;
    private String clubName;
}
