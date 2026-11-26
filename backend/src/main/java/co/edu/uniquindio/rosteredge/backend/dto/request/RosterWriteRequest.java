package co.edu.uniquindio.rosteredge.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public record RosterWriteRequest(
        @NotBlank @Size(max = 50) String name,
        @NotBlank @Email @Size(max = 50) String email,
        @Size(min = 12, max = 255) String password,
        Long clubId,
        Long subscriptionId,
        Boolean active) {
    @Override
    public String toString() {
        return "RosterWriteRequest[credential fields omitted]";
    }
}
