package co.edu.uniquindio.rosteredge.backend.repository.view;

import co.edu.uniquindio.rosteredge.backend.dto.filter.MatchScheduleFilter;
import co.edu.uniquindio.rosteredge.backend.dto.response.MatchResponse;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * Executes the complex match schedule joins with dynamic filters.
 */
@Repository
@RequiredArgsConstructor
public class MatchScheduleQueryRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public List<MatchResponse> findMatches(MatchScheduleFilter filter) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        StringBuilder sql = new StringBuilder()
            .append("SELECT m.id, m.matchday_id, md.name AS matchday_name, \n")
            .append("       m.start_time, m.end_time, m.date, \n")
            .append("       m.stadium_id, NULL::text AS stadium_name, \n")
            .append("       stadium.venue_id, venue.name AS venue_name, \n")
            .append("       venue.city_id, city.name AS city_name, \n")
            .append(
                "       country.id AS country_id, country.name AS country_name, \n"
            )
            .append("       event.season_id AS season_id, season.name AS season_name, \n")
            .append("       event.id AS event_id, event.name AS event_name, \n")
            .append(
                "       home.team_id AS home_team_id, homeTeam.name AS home_team_name, home.score AS home_score, \n"
            )
            .append(
                "       homeClub.id AS home_club_id, homeClub.name AS home_club_name, \n"
            )
            .append(
                "       away.team_id AS away_team_id, awayTeam.name AS away_team_name, away.score AS away_score, \n"
            )
            .append(
                "       awayClub.id AS away_club_id, awayClub.name AS away_club_name, \n"
            )
            .append(
                "       (CAST(COALESCE(home.score, 0) AS TEXT) || '-' || CAST(COALESCE(away.score, 0) AS TEXT)) AS result_label, \n"
            )
            .append(
                "       (CAST(m.date AS TIMESTAMP) + m.start_time) AS kickoff, \n"
            )
            .append(
                "       (CASE WHEN (m.date > CURRENT_DATE) OR (m.date = CURRENT_DATE AND m.end_time > CURRENT_TIME) THEN true ELSE false END) AS upcoming, \n"
            )
            .append(
                "       (CASE WHEN (m.date < CURRENT_DATE) OR (m.date = CURRENT_DATE AND m.end_time <= CURRENT_TIME) THEN true ELSE false END) AS played, \n"
            )
            .append("       m.active, m.created_at, m.updated_at \n")
            .append("FROM \"Match\" m \n")
            .append("LEFT JOIN \"Matchday\" md ON m.matchday_id = md.id \n")
            .append("LEFT JOIN \"Event\" event ON m.event_id = event.id \n")
            .append("LEFT JOIN \"Season\" season ON event.season_id = season.id \n")
            .append(
                "LEFT JOIN \"Stadium\" stadium ON m.stadium_id = stadium.id \n"
            )
            .append(
                "LEFT JOIN \"Venue\" venue ON stadium.venue_id = venue.id \n"
            )
            .append("LEFT JOIN \"City\" city ON venue.city_id = city.id \n")
            .append(
                "LEFT JOIN \"Country\" country ON city.country_id = country.id \n"
            )
            .append(
                "LEFT JOIN \"MatchHomeTeam\" home ON m.id = home.match_id \n"
            )
            .append(
                "LEFT JOIN \"Team\" homeTeam ON home.team_id = homeTeam.id \n"
            )
            .append(
                "LEFT JOIN \"Club\" homeClub ON homeTeam.club_id = homeClub.id \n"
            )
            .append(
                "LEFT JOIN \"MatchAwayTeam\" away ON m.id = away.match_id \n"
            )
            .append(
                "LEFT JOIN \"Team\" awayTeam ON away.team_id = awayTeam.id \n"
            )
            .append(
                "LEFT JOIN \"Club\" awayClub ON awayTeam.club_id = awayClub.id \n"
            )
            .append("WHERE 1 = 1");

        if (filter.getEventId() != null) {
            sql.append(" AND event.id = :eventId");
            parameters.addValue("eventId", filter.getEventId());
        }
        if (filter.getSeasonId() != null) {
            sql.append(" AND event.season_id = :seasonId");
            parameters.addValue("seasonId", filter.getSeasonId());
        }
        if (filter.getMatchdayId() != null) {
            sql.append(" AND m.matchday_id = :matchdayId");
            parameters.addValue("matchdayId", filter.getMatchdayId());
        }
        if (filter.getTeamId() != null) {
            sql.append(
                " AND (home.team_id = :teamId OR away.team_id = :teamId)"
            );
            parameters.addValue("teamId", filter.getTeamId());
        }
        if (filter.getClubId() != null) {
            sql.append(" AND (homeClub.id = :clubId OR awayClub.id = :clubId)");
            parameters.addValue("clubId", filter.getClubId());
        }
        if (filter.getStadiumId() != null) {
            sql.append(" AND m.stadium_id = :stadiumId");
            parameters.addValue("stadiumId", filter.getStadiumId());
        }
        if (filter.getVenueId() != null) {
            sql.append(" AND stadium.venue_id = :venueId");
            parameters.addValue("venueId", filter.getVenueId());
        }
        if (filter.getActive() != null) {
            sql.append(" AND m.active = :active");
            parameters.addValue("active", filter.getActive());
        }
        if (filter.getDateFrom() != null) {
            sql.append(" AND m.date >= :dateFrom");
            parameters.addValue("dateFrom", filter.getDateFrom());
        }
        if (filter.getDateTo() != null) {
            sql.append(" AND m.date <= :dateTo");
            parameters.addValue("dateTo", filter.getDateTo());
        }
        if (Boolean.TRUE.equals(filter.getUpcomingOnly())) {
            sql.append(
                " AND ((m.date > CURRENT_DATE) OR (m.date = CURRENT_DATE AND m.end_time > CURRENT_TIME))"
            );
        }
        if (Boolean.TRUE.equals(filter.getPlayedOnly())) {
            sql.append(
                " AND ((m.date < CURRENT_DATE) OR (m.date = CURRENT_DATE AND m.end_time <= CURRENT_TIME))"
            );
        }

        sql.append(" ORDER BY m.date DESC, m.start_time DESC, m.id DESC");

        return jdbcTemplate.query(
            sql.toString(),
            parameters,
            this::mapMatchResponse
        );
    }

    private MatchResponse mapMatchResponse(ResultSet rs, int rowNum)
        throws SQLException {
        return MatchResponse.builder()
            .id(rs.getLong("id"))
            .matchdayId(rs.getObject("matchday_id", Long.class))
            .matchdayName(rs.getString("matchday_name"))
            .startTime(rs.getObject("start_time", LocalTime.class))
            .endTime(rs.getObject("end_time", LocalTime.class))
            .date(rs.getObject("date", LocalDate.class))
            .stadiumId(rs.getObject("stadium_id", Long.class))
            .stadiumName(rs.getString("stadium_name"))
            .venueId(rs.getObject("venue_id", Long.class))
            .venueName(rs.getString("venue_name"))
            .cityId(rs.getObject("city_id", Long.class))
            .cityName(rs.getString("city_name"))
            .countryId(rs.getObject("country_id", Long.class))
            .countryName(rs.getString("country_name"))
            .seasonId(rs.getObject("season_id", Long.class))
            .seasonName(rs.getString("season_name"))
            .eventId(rs.getObject("event_id", Long.class))
            .eventName(rs.getString("event_name"))
            .homeTeamId(rs.getObject("home_team_id", Long.class))
            .homeTeamName(rs.getString("home_team_name"))
            .homeScore(rs.getObject("home_score", Integer.class))
            .homeClubId(rs.getObject("home_club_id", Long.class))
            .homeClubName(rs.getString("home_club_name"))
            .awayTeamId(rs.getObject("away_team_id", Long.class))
            .awayTeamName(rs.getString("away_team_name"))
            .awayScore(rs.getObject("away_score", Integer.class))
            .awayClubId(rs.getObject("away_club_id", Long.class))
            .awayClubName(rs.getString("away_club_name"))
            .resultLabel(rs.getString("result_label"))
            .kickoff(rs.getObject("kickoff", LocalDateTime.class))
            .upcoming(rs.getObject("upcoming", Boolean.class))
            .played(rs.getObject("played", Boolean.class))
            .active(rs.getObject("active", Boolean.class))
            .createdAt(rs.getObject("created_at", LocalDateTime.class))
            .updatedAt(rs.getObject("updated_at", LocalDateTime.class))
            .build();
    }
}
