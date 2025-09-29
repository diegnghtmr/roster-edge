package co.edu.uniquindio.rosteredge.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Response returned after successful roster login containing the issued token.
 */
@Data
@AllArgsConstructor
public class RosterLoginResponse {
    private String token;
}
