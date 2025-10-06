package co.edu.uniquindio.rosteredge.backend.repository.view;

import co.edu.uniquindio.rosteredge.backend.dto.filter.TeamInsightsFilter;
import co.edu.uniquindio.rosteredge.backend.dto.response.TeamInsightsResponse;
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
 * Executes the team insights query responsible for complex join filters.
 */
@Repository
@RequiredArgsConstructor
public class TeamInsightsQueryRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public List<TeamInsightsResponse> findTeams(TeamInsightsFilter filter) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        StringBuilder sql = new StringBuilder()
            .append("SELECT t.id, t.name, t.mascot, t.foundation, \n")
            .append("       t.club_id, club.name AS club_name, \n")
            .append("       t.category_id, category.name AS category_name, \n")
            .append("       t.gender_id, gender.name AS gender_name, \n")
            .append("       (SELECT COUNT(*) FROM \"Player\" p WHERE p.team_id = t.id) AS total_players, \n")
            .append("       (SELECT COUNT(*) FROM \"Player\" p WHERE p.team_id = t.id AND p.active = true) AS active_players, \n")
            .append("       (SELECT COUNT(*) FROM \"Staff\" s WHERE s.team_id = t.id) AS total_staff, \n")
            .append("       (SELECT COUNT(*) FROM \"Streak\" st WHERE st.team_id = t.id AND st.active = true) AS active_streaks, \n")
            .append("       (SELECT STRING_AGG(col.name, ', ' ORDER BY col.name) \n")
            .append("          FROM \"TeamColor\" tc2 \n")
            .append("          JOIN \"Color\" col ON col.id = tc2.color_id \n")
            .append("         WHERE tc2.team_id = t.id) AS color_palette, \n")
            .append("       t.active, t.created_at, t.updated_at \n")
            .append("FROM \"Team\" t \n")
            .append("LEFT JOIN \"Club\" club ON t.club_id = club.id \n")
            .append("LEFT JOIN \"TeamCategory\" category ON t.category_id = category.id \n")
            .append("LEFT JOIN \"TeamGender\" gender ON t.gender_id = gender.id \n")
            .append("WHERE 1 = 1");

        if (filter.getClubId() != null) {
            sql.append(" AND t.club_id = :clubId");
            parameters.addValue("clubId", filter.getClubId());
        }
        if (filter.getCategoryId() != null) {
            sql.append(" AND t.category_id = :categoryId");
            parameters.addValue("categoryId", filter.getCategoryId());
        }
        if (filter.getGenderId() != null) {
            sql.append(" AND t.gender_id = :genderId");
            parameters.addValue("genderId", filter.getGenderId());
        }
        if (filter.getColorId() != null) {
            sql.append(" AND EXISTS (SELECT 1 FROM \"TeamColor\" tc WHERE tc.team_id = t.id AND tc.color_id = :colorId)");
            parameters.addValue("colorId", filter.getColorId());
        }
        if (filter.getActive() != null) {
            sql.append(" AND t.active = :active");
            parameters.addValue("active", filter.getActive());
        }
        if (filter.getFoundedFrom() != null) {
            sql.append(" AND t.foundation >= :foundedFrom");
            parameters.addValue("foundedFrom", filter.getFoundedFrom());
        }
        if (filter.getFoundedTo() != null) {
            sql.append(" AND t.foundation <= :foundedTo");
            parameters.addValue("foundedTo", filter.getFoundedTo());
        }
        if (filter.getMinPlayers() != null) {
            sql.append(" AND (SELECT COUNT(*) FROM \"Player\" p WHERE p.team_id = t.id) >= :minPlayers");
            parameters.addValue("minPlayers", filter.getMinPlayers());
        }
        if (filter.getMaxPlayers() != null) {
            sql.append(" AND (SELECT COUNT(*) FROM \"Player\" p WHERE p.team_id = t.id) <= :maxPlayers");
            parameters.addValue("maxPlayers", filter.getMaxPlayers());
        }
        if (filter.getHasPlayers() != null) {
            if (Boolean.TRUE.equals(filter.getHasPlayers())) {
                sql.append(" AND EXISTS (SELECT 1 FROM \"Player\" p WHERE p.team_id = t.id)");
            } else {
                sql.append(" AND NOT EXISTS (SELECT 1 FROM \"Player\" p WHERE p.team_id = t.id)");
            }
        }
        if (filter.getHasStaff() != null) {
            if (Boolean.TRUE.equals(filter.getHasStaff())) {
                sql.append(" AND EXISTS (SELECT 1 FROM \"Staff\" s WHERE s.team_id = t.id)");
            } else {
                sql.append(" AND NOT EXISTS (SELECT 1 FROM \"Staff\" s WHERE s.team_id = t.id)");
            }
        }
        if (StringUtils.hasText(filter.getSearch())) {
            String pattern = "%" + filter.getSearch().trim().toLowerCase() + "%";
            sql.append(" AND (LOWER(t.name) LIKE :search OR LOWER(t.mascot) LIKE :search)");
            parameters.addValue("search", pattern);
        }

        sql.append(" ORDER BY t.name ASC, t.id ASC");

        return jdbcTemplate.query(sql.toString(), parameters, this::mapTeamInsights);
    }

    private TeamInsightsResponse mapTeamInsights(ResultSet rs, int rowNum) throws SQLException {
        return TeamInsightsResponse.builder()
            .id(rs.getLong("id"))
            .name(rs.getString("name"))
            .mascot(rs.getString("mascot"))
            .foundation(rs.getObject("foundation", LocalDate.class))
            .clubId(rs.getObject("club_id", Long.class))
            .clubName(rs.getString("club_name"))
            .categoryId(rs.getObject("category_id", Long.class))
            .categoryName(rs.getString("category_name"))
            .genderId(rs.getObject("gender_id", Long.class))
            .genderName(rs.getString("gender_name"))
            .totalPlayers(getAsInt(rs, "total_players"))
            .activePlayers(getAsInt(rs, "active_players"))
            .totalStaff(getAsInt(rs, "total_staff"))
            .activeStreaks(getAsInt(rs, "active_streaks"))
            .colorPalette(rs.getString("color_palette"))
            .active(rs.getObject("active", Boolean.class))
            .createdAt(rs.getObject("created_at", LocalDateTime.class))
            .updatedAt(rs.getObject("updated_at", LocalDateTime.class))
            .build();
    }

    private Integer getAsInt(ResultSet rs, String column) throws SQLException {
        Long value = rs.getObject(column, Long.class);
        return value != null ? value.intValue() : null;
    }
}
