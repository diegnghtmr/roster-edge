package co.edu.uniquindio.rosteredge.backend.repository.view;

import co.edu.uniquindio.rosteredge.backend.dto.filter.PlayerOverviewFilter;
import co.edu.uniquindio.rosteredge.backend.dto.response.PlayerResponse;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

/**
 * Executes the player overview query with dynamic filters and joins.
 */
@Repository
@RequiredArgsConstructor
public class PlayerOverviewQueryRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public List<PlayerResponse> findPlayers(PlayerOverviewFilter filter) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        StringBuilder sql = new StringBuilder()
            .append("SELECT p.id, p.email, p.name, p.last_name, ")
            .append("       (p.name || ' ' || p.last_name) AS full_name, ")
            .append("       p.city_id, city.name AS city_name, ")
            .append("       country.id AS country_id, country.name AS country_name, ")
            .append("       team.club_id AS club_id, club.name AS club_name, ")
            .append("       p.phone, p.birth_date, ")
            .append("       CAST(EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.birth_date)) AS INTEGER) AS age_years, ")
            .append("       p.physical_state_id, ps.name AS physical_state_name, ")
            .append("       p.jersey_number, p.height, p.dominant_foot, p.weight, ")
            .append("       p.primary_position_id, position.name AS primary_position_name, ")
            .append("       p.team_id, team.name AS team_name, ")
            .append("       p.active, p.created_at, p.updated_at ")
            .append("FROM \"Player\" p \n")
            .append("LEFT JOIN \"Team\" team ON p.team_id = team.id \n")
            .append("LEFT JOIN \"Club\" club ON team.club_id = club.id \n")
            .append("LEFT JOIN \"PlayerPosition\" position ON p.primary_position_id = position.id \n")
            .append("LEFT JOIN \"PhysicalState\" ps ON p.physical_state_id = ps.id \n")
            .append("LEFT JOIN \"City\" city ON p.city_id = city.id \n")
            .append("LEFT JOIN \"Country\" country ON city.country_id = country.id \n")
            .append("WHERE 1 = 1");

        if (filter.getTeamId() != null) {
            sql.append(" AND p.team_id = :teamId");
            parameters.addValue("teamId", filter.getTeamId());
        }
        if (filter.getClubId() != null) {
            sql.append(" AND team.club_id = :clubId");
            parameters.addValue("clubId", filter.getClubId());
        }
        if (filter.getPrimaryPositionId() != null) {
            sql.append(" AND p.primary_position_id = :positionId");
            parameters.addValue("positionId", filter.getPrimaryPositionId());
        }
        if (filter.getPhysicalStateId() != null) {
            sql.append(" AND p.physical_state_id = :stateId");
            parameters.addValue("stateId", filter.getPhysicalStateId());
        }
        if (filter.getCountryId() != null) {
            sql.append(" AND country.id = :countryId");
            parameters.addValue("countryId", filter.getCountryId());
        }
        if (filter.getActive() != null) {
            sql.append(" AND p.active = :active");
            parameters.addValue("active", filter.getActive());
        }
        if (filter.getAgeFrom() != null) {
            sql.append(" AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.birth_date)) >= :ageFrom");
            parameters.addValue("ageFrom", filter.getAgeFrom());
        }
        if (filter.getAgeTo() != null) {
            sql.append(" AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.birth_date)) <= :ageTo");
            parameters.addValue("ageTo", filter.getAgeTo());
        }
        if (StringUtils.hasText(filter.getSearch())) {
            String pattern = "%" + filter.getSearch().trim().toLowerCase() + "%";
            sql.append(" AND (LOWER(p.name) LIKE :search OR LOWER(p.last_name) LIKE :search OR LOWER(p.email) LIKE :search)");
            parameters.addValue("search", pattern);
        }
        if (StringUtils.hasText(filter.getJerseyNumber())) {
            String jerseyPattern = "%" + filter.getJerseyNumber().trim().toLowerCase() + "%";
            sql.append(" AND LOWER(p.jersey_number) LIKE :jersey");
            parameters.addValue("jersey", jerseyPattern);
        }

        sql.append(" ORDER BY p.name ASC, p.last_name ASC, p.id ASC");

        return jdbcTemplate.query(sql.toString(), parameters, this::mapPlayerResponse);
    }

    private PlayerResponse mapPlayerResponse(ResultSet rs, int rowNum) throws SQLException {
        Long teamId = rs.getObject("team_id", Long.class);
        Long clubId = rs.getObject("club_id", Long.class);

        PlayerResponse.PlayerResponseBuilder builder = PlayerResponse.builder()
            .id(rs.getLong("id"))
            .email(rs.getString("email"))
            .name(rs.getString("name"))
            .lastName(rs.getString("last_name"))
            .fullName(rs.getString("full_name"))
            .cityId(rs.getObject("city_id", Long.class))
            .cityName(rs.getString("city_name"))
            .countryId(rs.getObject("country_id", Long.class))
            .countryName(rs.getString("country_name"))
            .clubId(clubId)
            .clubName(rs.getString("club_name"))
            .phone(rs.getString("phone"))
            .birthDate(rs.getObject("birth_date", LocalDate.class))
            .age(rs.getObject("age_years", Integer.class))
            .physicalStateId(rs.getObject("physical_state_id", Long.class))
            .physicalStateName(rs.getString("physical_state_name"))
            .jerseyNumber(rs.getString("jersey_number"))
            .height(rs.getString("height"))
            .dominantFoot(rs.getString("dominant_foot"))
            .weight(rs.getString("weight"))
            .primaryPositionId(rs.getObject("primary_position_id", Long.class))
            .primaryPositionName(rs.getString("primary_position_name"))
            .teamId(teamId)
            .teamName(rs.getString("team_name"))
            .active(rs.getObject("active", Boolean.class))
            .createdAt(rs.getObject("created_at", LocalDateTime.class))
            .updatedAt(rs.getObject("updated_at", LocalDateTime.class));

        if (teamId != null) {
            builder.team(PlayerResponse.TeamSummary.builder()
                .id(teamId)
                .name(rs.getString("team_name"))
                .clubId(clubId)
                .clubName(rs.getString("club_name"))
                .build());
        }

        return builder.build();
    }
}
