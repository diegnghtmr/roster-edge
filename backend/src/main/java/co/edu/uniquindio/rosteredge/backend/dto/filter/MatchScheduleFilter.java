package co.edu.uniquindio.rosteredge.backend.dto.filter;

import java.time.LocalDate;
import lombok.Data;

/**
 * Query parameters for the match schedule endpoint.
 */
@Data
public class MatchScheduleFilter {

    private Long eventId;
    private Long seasonId;
    private Long matchdayId;
    private Long teamId;
    private Long clubId;
    private Long stadiumId;
    private Long venueId;
    private Boolean active;
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private Boolean upcomingOnly;
    private Boolean playedOnly;
}
