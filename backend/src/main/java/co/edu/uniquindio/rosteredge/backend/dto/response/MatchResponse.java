package co.edu.uniquindio.rosteredge.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for Match entity enriched with contextual joins.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MatchResponse {

    private Long id;
    private Long matchdayId;
    private String matchdayName;

    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate date;

    private Long stadiumId;
    private String stadiumName;

    private Long venueId;
    private String venueName;

    private Long cityId;
    private String cityName;

    private Long countryId;
    private String countryName;

    private Long eventId;
    private String eventName;
    private Long seasonId;
    private String seasonName;

    private Long homeTeamId;
    private String homeTeamName;
    private Integer homeScore;
    private Long homeClubId;
    private String homeClubName;

    private Long awayTeamId;
    private String awayTeamName;
    private Integer awayScore;
    private Long awayClubId;
    private String awayClubName;

    private String resultLabel;
    private LocalDateTime kickoff;
    private Boolean upcoming;
    private Boolean played;

    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
