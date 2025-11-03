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

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class VenueDTO extends BaseDTO {

    @NotBlank(message = "Email is required")
    @Size(max = 150, message = "Email cannot exceed 150 characters")
    private String email;

    @NotNull(message = "City ID is required")
    private Long cityId;

    @NotNull(message = "Foundation date is required")
    private LocalDate foundation;

    @NotBlank(message = "Venue name is required")
    @Size(max = 150, message = "Venue name cannot exceed 150 characters")
    private String name;

    @NotBlank(message = "Phone is required")
    @Size(max = 30, message = "Phone cannot exceed 30 characters")
    private String phone;

    @NotNull(message = "Club ID is required")
    private Long clubId;
}
