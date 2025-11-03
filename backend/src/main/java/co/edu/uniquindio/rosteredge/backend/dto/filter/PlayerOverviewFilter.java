package co.edu.uniquindio.rosteredge.backend.dto.filter;

import lombok.Data;

/**
 * Query parameters for the player overview endpoint.
 */
@Data
public class PlayerOverviewFilter {

    private Long teamId;
    private Long clubId;
    private Long primaryPositionId;
    private Long physicalStateId;
    private Long countryId;
    private Boolean active;
    private Integer ageFrom;
    private Integer ageTo;
    private String search;
    private String jerseyNumber;
}
