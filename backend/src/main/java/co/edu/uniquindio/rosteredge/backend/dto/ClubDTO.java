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
public class ClubDTO extends BaseDTO {

    @NotBlank(message = "Club name is required")
    @Size(max = 150, message = "Club name cannot exceed 150 characters")
    private String name;

    @Size(max = 500, message = "Motto cannot exceed 500 characters")
    private String motto;

    @NotNull(message = "Foundation date is required")
    private LocalDate foundation;
}
