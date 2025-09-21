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
 * DTO for Event entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class EventDTO extends BaseDTO {

    @NotNull(message = "Season ID is required")
    private Long seasonId;

    private Long venueId;

    @NotBlank(message = "Event name is required")
    @Size(max = 150, message = "Event name cannot exceed 150 characters")
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Event date is required")
    private LocalDate date;

    // Additional fields for display purposes
    private String seasonName;
    private String venueName;
}
