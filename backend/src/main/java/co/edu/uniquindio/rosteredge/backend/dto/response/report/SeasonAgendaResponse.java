package co.edu.uniquindio.rosteredge.backend.dto.response.report;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Result payload for the season agenda report.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SeasonAgendaResponse {

    private Long eventId;
    private String eventName;
    private LocalDate eventDate;
    private Long daysToEvent;
    private String phase;

    private Long seasonId;
    private String seasonName;
    private LocalDate seasonStartDate;
    private LocalDate seasonEndDate;

    private Long clubId;
    private String clubName;

    private Long venueId;
    private String venueName;
    private Long cityId;
    private String cityName;
}
