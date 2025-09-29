package co.edu.uniquindio.rosteredge.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Represents the roster administrator associated with a session token.
 */
@Data
@AllArgsConstructor
public class RosterSessionResponse {
    private Long id;
    private String name;
    private String email;
    private Long clubId;
    private Long subscriptionId;
}
