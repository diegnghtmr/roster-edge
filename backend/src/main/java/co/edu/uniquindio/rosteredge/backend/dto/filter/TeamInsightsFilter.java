package co.edu.uniquindio.rosteredge.backend.dto.filter;

import java.time.LocalDate;
import lombok.Data;

/**
 * Query parameters for the team insights endpoint.
 */
@Data
public class TeamInsightsFilter {

    private Long clubId;
    private Long categoryId;
    private Long genderId;
    private Long colorId;
    private Boolean active;
    private Boolean hasPlayers;
    private Boolean hasStaff;
    private Integer minPlayers;
    private Integer maxPlayers;
    private String search;
    private LocalDate foundedFrom;
    private LocalDate foundedTo;
}
