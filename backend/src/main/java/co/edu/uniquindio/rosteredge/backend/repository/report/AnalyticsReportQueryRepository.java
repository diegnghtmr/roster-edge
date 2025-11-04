package co.edu.uniquindio.rosteredge.backend.repository.report;

import co.edu.uniquindio.rosteredge.backend.dto.filter.report.CategoryParticipationReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.MatchLoadReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.PaymentMethodReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.PointsProgressReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.RosterProfileReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.ScheduleDensityReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.ScoringRankingReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.SeasonAgendaReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.SeasonStandingsReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.StaffImpactReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.StaffRatioReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.filter.report.SubscriptionPlanReportFilter;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.CategoryParticipationResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.PaymentMethodPerformanceResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.ScheduleDensityResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.ScoringRankingResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.SeasonAgendaResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.SeasonStandingResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.StaffImpactResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.StaffImpactResponse.TeamStaffImpactDetail;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.SubscriptionPlanPerformanceResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamMatchLoadResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamPointsProgressResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamRosterProfileResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamRosterProfileResponse.PhysicalStateBreakdown;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamStaffRatioResponse;
import co.edu.uniquindio.rosteredge.backend.dto.response.report.TeamStaffRatioResponse.StaffRoleBreakdown;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.sql.Types;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * Repository in charge of executing the complex analytics queries.
 */
@Repository
@RequiredArgsConstructor
@Slf4j
public class AnalyticsReportQueryRepository {

    private static final TypeReference<List<PhysicalStateBreakdown>> PHYSICAL_STATE_TYPE =
        new TypeReference<>() {};
    private static final TypeReference<List<StaffRoleBreakdown>> STAFF_ROLE_TYPE =
        new TypeReference<>() {};

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public List<TeamRosterProfileResponse> findTeamRosters(RosterProfileReportFilter filter) {
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("clubId", filter.getClubId(), Types.BIGINT)
            .addValue("teamId", filter.getTeamId(), Types.BIGINT)
            .addValue("onlyActiveTeams", filter.getOnlyActiveTeams(), Types.BOOLEAN)
            .addValue("onlyActivePlayers", filter.getOnlyActivePlayers(), Types.BOOLEAN);

        String sql = """
            WITH stats AS (
                SELECT p.team_id,
                       COUNT(*) AS total_players,
                       COUNT(*) FILTER (WHERE p.active = true) AS active_players,
                       AVG(EXTRACT(YEAR FROM age(CURRENT_DATE, p.birth_date))) FILTER (
                           WHERE (:onlyActivePlayers IS NOT TRUE) OR p.active = true
                       ) AS average_age
                FROM "Player" p
                GROUP BY p.team_id
            ),
            states AS (
                SELECT p.team_id,
                       p.physical_state_id,
                       ps.name AS physical_state_name,
                       COUNT(*) FILTER (
                           WHERE (:onlyActivePlayers IS NOT TRUE) OR p.active = true
                       ) AS players
                FROM "Player" p
                LEFT JOIN "PhysicalState" ps ON ps.id = p.physical_state_id
                GROUP BY p.team_id, p.physical_state_id, ps.name
            )
            SELECT t.id AS team_id,
                   t.name AS team_name,
                   c.id AS club_id,
                   c.name AS club_name,
                   COALESCE(stats.total_players, 0) AS total_players,
                   COALESCE(stats.active_players, 0) AS active_players,
                   stats.average_age AS average_age,
                   COALESCE((
                       SELECT jsonb_agg(jsonb_build_object(
                           'physicalStateId', st.physical_state_id,
                           'physicalStateName', st.physical_state_name,
                           'players', st.players
                       ) ORDER BY st.players DESC NULLS LAST)
                       FROM states st
                       WHERE st.team_id = t.id
                   ), '[]'::jsonb) AS physical_states
            FROM "Team" t
            JOIN "Club" c ON c.id = t.club_id
            LEFT JOIN stats ON stats.team_id = t.id
            WHERE (:clubId IS NULL OR t.club_id = :clubId)
              AND (:teamId IS NULL OR t.id = :teamId)
              AND (:onlyActiveTeams IS NOT TRUE OR t.active = true)
            ORDER BY c.name, t.name, t.id
            """;

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> TeamRosterProfileResponse.builder()
            .teamId(rs.getLong("team_id"))
            .teamName(rs.getString("team_name"))
            .clubId(rs.getLong("club_id"))
            .clubName(rs.getString("club_name"))
            .totalPlayers(getAsInt(rs, "total_players"))
            .activePlayers(getAsInt(rs, "active_players"))
            .averageAge(getAsDouble(rs, "average_age"))
            .physicalStates(parsePhysicalStates(rs.getString("physical_states")))
            .build());
    }

    public List<SeasonAgendaResponse> findSeasonAgenda(SeasonAgendaReportFilter filter) {
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("clubId", filter.getClubId(), Types.BIGINT)
            .addValue("seasonId", filter.getSeasonId(), Types.BIGINT)
            .addValue("fromDate", filter.getFromDate(), Types.DATE)
            .addValue("toDate", filter.getToDate(), Types.DATE)
            .addValue("horizonDays", filter.getHorizonDays(), Types.INTEGER);

        String sql = """
            SELECT e.id AS event_id,
                   e.name AS event_name,
                   e.date AS event_date,
                   (e.date - CURRENT_DATE) AS days_to_event,
                   CASE
                       WHEN e.date < CURRENT_DATE THEN 'Finalizado'
                       WHEN e.date = CURRENT_DATE THEN 'Hoy'
                       WHEN s.start_date <= e.date AND e.date <= s.end_date THEN 'En curso'
                       ELSE 'Próximo'
                   END AS phase,
                   s.id AS season_id,
                   s.name AS season_name,
                   s.start_date AS season_start_date,
                   s.end_date AS season_end_date,
                   c.id AS club_id,
                   c.name AS club_name,
                   v.id AS venue_id,
                   v.name AS venue_name,
                   city.id AS city_id,
                   city.name AS city_name
            FROM "Event" e
            JOIN "Season" s ON s.id = e.season_id
            JOIN "Club" c ON c.id = s.club_id
            LEFT JOIN "Venue" v ON v.id = e.venue_id
            LEFT JOIN "City" city ON city.id = v.city_id
            WHERE e.active = true
              AND s.active = true
              AND (:clubId IS NULL OR s.club_id = :clubId)
              AND (:seasonId IS NULL OR s.id = :seasonId)
              AND (:fromDate IS NULL OR e.date >= :fromDate)
              AND (:toDate IS NULL OR e.date <= :toDate)
              AND (
                  :horizonDays IS NULL
                  OR e.date BETWEEN CURRENT_DATE AND CURRENT_DATE + (:horizonDays * INTERVAL '1 day')
              )
            ORDER BY e.date ASC, e.id ASC
            """;

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> SeasonAgendaResponse.builder()
            .eventId(rs.getLong("event_id"))
            .eventName(rs.getString("event_name"))
            .eventDate(rs.getObject("event_date", LocalDate.class))
            .daysToEvent(getAsLong(rs, "days_to_event"))
            .phase(rs.getString("phase"))
            .seasonId(rs.getLong("season_id"))
            .seasonName(rs.getString("season_name"))
            .seasonStartDate(rs.getObject("season_start_date", LocalDate.class))
            .seasonEndDate(rs.getObject("season_end_date", LocalDate.class))
            .clubId(rs.getLong("club_id"))
            .clubName(rs.getString("club_name"))
            .venueId(rs.getObject("venue_id", Long.class))
            .venueName(rs.getString("venue_name"))
            .cityId(rs.getObject("city_id", Long.class))
            .cityName(rs.getString("city_name"))
            .build());
    }

    public List<TeamMatchLoadResponse> findMatchLoad(MatchLoadReportFilter filter) {
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("clubId", filter.getClubId(), Types.BIGINT)
            .addValue("seasonId", filter.getSeasonId(), Types.BIGINT)
            .addValue("teamId", filter.getTeamId(), Types.BIGINT);

        String sql = """
            WITH participations AS (
                SELECT m.id AS match_id,
                       e.season_id,
                       home.team_id AS team_id,
                       t.club_id,
                       1 AS is_home,
                       0 AS is_away
                FROM "Match" m
                JOIN "Event" e ON e.id = m.event_id
                JOIN "MatchHomeTeam" home ON home.match_id = m.id
                JOIN "Team" t ON t.id = home.team_id
                WHERE m.active = true
                UNION ALL
                SELECT m.id,
                       e.season_id,
                       away.team_id,
                       t.club_id,
                       0,
                       1
                FROM "Match" m
                JOIN "Event" e ON e.id = m.event_id
                JOIN "MatchAwayTeam" away ON away.match_id = m.id
                JOIN "Team" t ON t.id = away.team_id
                WHERE m.active = true
            )
            SELECT s.id AS season_id,
                   s.name AS season_name,
                   t.id AS team_id,
                   t.name AS team_name,
                   c.id AS club_id,
                   c.name AS club_name,
                   COUNT(*) FILTER (WHERE p.is_home = 1) AS home_matches,
                   COUNT(*) FILTER (WHERE p.is_away = 1) AS away_matches,
                   COUNT(*) AS total_matches
            FROM "Team" t
            JOIN "Club" c ON c.id = t.club_id
            JOIN participations p ON p.team_id = t.id
            JOIN "Season" s ON s.id = p.season_id
            WHERE (:clubId IS NULL OR c.id = :clubId)
              AND (:seasonId IS NULL OR s.id = :seasonId)
              AND (:teamId IS NULL OR t.id = :teamId)
            GROUP BY s.id, s.name, t.id, t.name, c.id, c.name
            ORDER BY s.start_date DESC, t.name ASC
            """;

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> TeamMatchLoadResponse.builder()
            .seasonId(rs.getLong("season_id"))
            .seasonName(rs.getString("season_name"))
            .teamId(rs.getLong("team_id"))
            .teamName(rs.getString("team_name"))
            .clubId(rs.getLong("club_id"))
            .clubName(rs.getString("club_name"))
            .homeMatches(getAsInt(rs, "home_matches"))
            .awayMatches(getAsInt(rs, "away_matches"))
            .totalMatches(getAsInt(rs, "total_matches"))
            .build());
    }

    public List<ScoringRankingResponse> findScoringRanking(ScoringRankingReportFilter filter) {
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("clubId", filter.getClubId(), Types.BIGINT)
            .addValue("seasonId", filter.getSeasonId(), Types.BIGINT);

        String sql = """
            WITH team_matches AS (
                SELECT e.season_id,
                       home.team_id AS team_id,
                       t.club_id,
                       m.id AS match_id,
                       m.date,
                       home.score AS goals_for,
                       away.score AS goals_against
                FROM "Match" m
                JOIN "Event" e ON e.id = m.event_id
                JOIN "MatchHomeTeam" home ON home.match_id = m.id
                JOIN "MatchAwayTeam" away ON away.match_id = m.id
                JOIN "Team" t ON t.id = home.team_id
                WHERE m.active = true
                UNION ALL
                SELECT e.season_id,
                       away.team_id AS team_id,
                       t.club_id,
                       m.id,
                       m.date,
                       away.score,
                       home.score
                FROM "Match" m
                JOIN "Event" e ON e.id = m.event_id
                JOIN "MatchHomeTeam" home ON home.match_id = m.id
                JOIN "MatchAwayTeam" away ON away.match_id = m.id
                JOIN "Team" t ON t.id = away.team_id
                WHERE m.active = true
            )
            SELECT s.id AS season_id,
                   s.name AS season_name,
                   t.id AS team_id,
                   t.name AS team_name,
                   c.id AS club_id,
                   c.name AS club_name,
                   COUNT(tm.match_id) AS matches_played,
                   SUM(tm.goals_for) AS goals_for,
                   SUM(tm.goals_against) AS goals_against,
                   SUM(tm.goals_for) - SUM(tm.goals_against) AS goal_difference,
                   (SUM(tm.goals_for)::numeric / NULLIF(COUNT(tm.match_id), 0))::double precision AS goals_per_match,
                   (SUM(tm.goals_against)::numeric / NULLIF(COUNT(tm.match_id), 0))::double precision AS goals_against_per_match
            FROM team_matches tm
            JOIN "Season" s ON s.id = tm.season_id
            JOIN "Team" t ON t.id = tm.team_id
            JOIN "Club" c ON c.id = t.club_id
            WHERE (:clubId IS NULL OR c.id = :clubId)
              AND (:seasonId IS NULL OR s.id = :seasonId)
            GROUP BY s.id, s.name, t.id, t.name, c.id, c.name
            ORDER BY s.start_date DESC, goal_difference DESC, goals_for DESC
            """;

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> ScoringRankingResponse.builder()
            .seasonId(rs.getLong("season_id"))
            .seasonName(rs.getString("season_name"))
            .teamId(rs.getLong("team_id"))
            .teamName(rs.getString("team_name"))
            .clubId(rs.getLong("club_id"))
            .clubName(rs.getString("club_name"))
            .matchesPlayed(getAsInt(rs, "matches_played"))
            .goalsFor(getAsInt(rs, "goals_for"))
            .goalsAgainst(getAsInt(rs, "goals_against"))
            .goalDifference(getAsInt(rs, "goal_difference"))
            .goalsPerMatch(getAsDouble(rs, "goals_per_match"))
            .goalsAgainstPerMatch(getAsDouble(rs, "goals_against_per_match"))
            .build());
    }

    public List<TeamStaffRatioResponse> findStaffRatios(StaffRatioReportFilter filter) {
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("clubId", filter.getClubId(), Types.BIGINT)
            .addValue("teamId", filter.getTeamId(), Types.BIGINT);

        String sql = """
            WITH player_stats AS (
                SELECT p.team_id,
                       COUNT(*) AS players,
                       COUNT(*) FILTER (WHERE p.active = true) AS active_players
                FROM "Player" p
                GROUP BY p.team_id
            ),
            staff_stats AS (
                SELECT s.team_id,
                       COUNT(*) AS staff,
                       COUNT(*) FILTER (WHERE s.active = true) AS active_staff,
                       AVG(EXTRACT(YEAR FROM age(CURRENT_DATE, s.hire_date))) FILTER (WHERE s.hire_date IS NOT NULL) AS average_tenure
                FROM "Staff" s
                GROUP BY s.team_id
            ),
            staff_by_role AS (
                SELECT s.team_id,
                       sr.id AS role_id,
                       sr.name AS role_name,
                       COUNT(*) AS staff_count
                FROM "Staff" s
                LEFT JOIN "StaffRole" sr ON sr.id = s.staff_role_id
                GROUP BY s.team_id, sr.id, sr.name
            )
            SELECT t.id AS team_id,
                   t.name AS team_name,
                   c.id AS club_id,
                   c.name AS club_name,
                   COALESCE(ps.players, 0) AS players,
                   COALESCE(ps.active_players, 0) AS active_players,
                   COALESCE(ss.staff, 0) AS staff,
                   COALESCE(ss.active_staff, 0) AS active_staff,
                   ss.average_tenure AS average_tenure,
                   COALESCE((
                       SELECT jsonb_agg(jsonb_build_object(
                           'roleId', r.role_id,
                           'roleName', r.role_name,
                           'staffCount', r.staff_count
                       ) ORDER BY r.staff_count DESC NULLS LAST)
                       FROM staff_by_role r
                       WHERE r.team_id = t.id
                   ), '[]'::jsonb) AS role_breakdown
            FROM "Team" t
            JOIN "Club" c ON c.id = t.club_id
            LEFT JOIN player_stats ps ON ps.team_id = t.id
            LEFT JOIN staff_stats ss ON ss.team_id = t.id
            WHERE (:clubId IS NULL OR c.id = :clubId)
              AND (:teamId IS NULL OR t.id = :teamId)
            ORDER BY c.name, t.name
            """;

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> TeamStaffRatioResponse.builder()
            .teamId(rs.getLong("team_id"))
            .teamName(rs.getString("team_name"))
            .clubId(rs.getLong("club_id"))
            .clubName(rs.getString("club_name"))
            .players(getAsInt(rs, "players"))
            .activePlayers(getAsInt(rs, "active_players"))
            .staff(getAsInt(rs, "staff"))
            .activeStaff(getAsInt(rs, "active_staff"))
            .averageStaffTenure(getAsDouble(rs, "average_tenure"))
            .staffToPlayerRatio(calculateRatio(getAsInt(rs, "staff"), getAsInt(rs, "players")))
            .roleBreakdown(parseRoleBreakdown(rs.getString("role_breakdown")))
            .build());
    }

    public List<TeamPointsProgressResponse> findPointsProgress(PointsProgressReportFilter filter) {
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("seasonId", filter.getSeasonId(), Types.BIGINT)
            .addValue("teamId", filter.getTeamId(), Types.BIGINT);

        String sql = """
            WITH team_points AS (
                SELECT e.season_id,
                       m.id AS match_id,
                       m.date AS match_date,
                       m.matchday_id,
                       md.name AS matchday_name,
                       home.team_id AS team_id,
                       t.name AS team_name,
                       s.id AS club_id,
                       s.name AS club_name,
                       CASE
                           WHEN home.score > away.score THEN 3
                           WHEN home.score = away.score THEN 1
                           ELSE 0
                       END AS points_earned,
                       home.score AS goals_for,
                       away.score AS goals_against
                FROM "Match" m
                JOIN "MatchHomeTeam" home ON home.match_id = m.id
                JOIN "MatchAwayTeam" away ON away.match_id = m.id
                JOIN "Event" e ON e.id = m.event_id
                JOIN "Season" s ON s.id = e.season_id
                JOIN "Team" t ON t.id = home.team_id
                LEFT JOIN "Matchday" md ON md.id = m.matchday_id
                WHERE m.active = true
                UNION ALL
                SELECT e.season_id,
                       m.id,
                       m.date,
                       m.matchday_id,
                       md.name,
                       away.team_id,
                       t.name,
                       s.id,
                       s.name,
                       CASE
                           WHEN away.score > home.score THEN 3
                           WHEN away.score = home.score THEN 1
                           ELSE 0
                       END,
                       away.score,
                       home.score
                FROM "Match" m
                JOIN "MatchHomeTeam" home ON home.match_id = m.id
                JOIN "MatchAwayTeam" away ON away.match_id = m.id
                JOIN "Event" e ON e.id = m.event_id
                JOIN "Season" s ON s.id = e.season_id
                JOIN "Team" t ON t.id = away.team_id
                LEFT JOIN "Matchday" md ON md.id = m.matchday_id
                WHERE m.active = true
            )
            SELECT season_id,
                   s.name AS season_name,
                   team_id,
                   team_name,
                   match_id,
                   match_date,
                   matchday_id,
                   matchday_name,
                   ROW_NUMBER() OVER (PARTITION BY season_id, team_id ORDER BY match_date, match_id) AS match_number,
                   points_earned,
                   SUM(points_earned) OVER (PARTITION BY season_id, team_id ORDER BY match_date, match_id ROWS UNBOUNDED PRECEDING) AS cumulative_points,
                   goals_for,
                   goals_against,
                   goals_for - goals_against AS goal_difference
            FROM team_points tp
            JOIN "Season" s ON s.id = tp.season_id
            WHERE (:seasonId IS NULL OR season_id = :seasonId)
              AND (:teamId IS NULL OR team_id = :teamId)
            ORDER BY season_id, team_id, match_date, match_id
            """;

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> TeamPointsProgressResponse.builder()
            .seasonId(rs.getLong("season_id"))
            .seasonName(rs.getString("season_name"))
            .teamId(rs.getLong("team_id"))
            .teamName(rs.getString("team_name"))
            .matchId(rs.getLong("match_id"))
            .matchDate(rs.getObject("match_date", LocalDate.class))
            .matchdayId(rs.getObject("matchday_id", Long.class))
            .matchdayName(rs.getString("matchday_name"))
            .matchNumber(getAsInt(rs, "match_number"))
            .pointsEarned(getAsInt(rs, "points_earned"))
            .cumulativePoints(getAsInt(rs, "cumulative_points"))
            .goalsFor(getAsInt(rs, "goals_for"))
            .goalsAgainst(getAsInt(rs, "goals_against"))
            .goalDifference(getAsInt(rs, "goal_difference"))
            .build());
    }

    public List<CategoryParticipationResponse> findCategoryParticipation(CategoryParticipationReportFilter filter) {
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("clubId", filter.getClubId(), Types.BIGINT)
            .addValue("seasonId", filter.getSeasonId(), Types.BIGINT);

        String sql = """
            WITH club_matches AS (
                SELECT e.season_id,
                       t.id AS team_id,
                       t.club_id,
                       t.category_id,
                       t.gender_id,
                       m.id AS match_id
                FROM "Match" m
                JOIN "Event" e ON e.id = m.event_id
                JOIN "MatchHomeTeam" home ON home.match_id = m.id
                JOIN "Team" t ON t.id = home.team_id
                WHERE m.active = true
                UNION ALL
                SELECT e.season_id,
                       t.id,
                       t.club_id,
                       t.category_id,
                       t.gender_id,
                       m.id
                FROM "Match" m
                JOIN "Event" e ON e.id = m.event_id
                JOIN "MatchAwayTeam" away ON away.match_id = m.id
                JOIN "Team" t ON t.id = away.team_id
                WHERE m.active = true
            ),
            total AS (
                SELECT season_id,
                       club_id,
                       COUNT(DISTINCT match_id) AS total_matches
                FROM club_matches
                GROUP BY season_id, club_id
            )
            SELECT cm.season_id,
                   s.name AS season_name,
                   cm.club_id,
                   c.name AS club_name,
                   cm.category_id,
                   tc.name AS category_name,
                   cm.gender_id,
                   tg.name AS gender_name,
                   COUNT(DISTINCT cm.match_id) AS matches_count,
                   (COUNT(DISTINCT cm.match_id)::numeric / NULLIF(total.total_matches, 0))::double precision AS participation_percentage
            FROM club_matches cm
            JOIN "Club" c ON c.id = cm.club_id
            JOIN "Season" s ON s.id = cm.season_id
            LEFT JOIN "TeamCategory" tc ON tc.id = cm.category_id
            LEFT JOIN "TeamGender" tg ON tg.id = cm.gender_id
            JOIN total ON total.season_id = cm.season_id AND total.club_id = cm.club_id
            WHERE (:clubId IS NULL OR cm.club_id = :clubId)
              AND (:seasonId IS NULL OR cm.season_id = :seasonId)
            GROUP BY cm.season_id, s.name, cm.club_id, c.name, cm.category_id, tc.name, cm.gender_id, tg.name, total.total_matches
            ORDER BY cm.club_id, cm.season_id, matches_count DESC
            """;

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> CategoryParticipationResponse.builder()
            .seasonId(rs.getLong("season_id"))
            .seasonName(rs.getString("season_name"))
            .clubId(rs.getLong("club_id"))
            .clubName(rs.getString("club_name"))
            .categoryId(rs.getObject("category_id", Long.class))
            .categoryName(rs.getString("category_name"))
            .genderId(rs.getObject("gender_id", Long.class))
            .genderName(rs.getString("gender_name"))
            .matchesCount(getAsInt(rs, "matches_count"))
            .participationPercentage(getAsDouble(rs, "participation_percentage"))
            .build());
    }

    public List<SeasonStandingResponse> findSeasonStandings(SeasonStandingsReportFilter filter) {
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("clubId", filter.getClubId(), Types.BIGINT)
            .addValue("seasonId", filter.getSeasonId(), Types.BIGINT);

        String sql = """
            WITH team_results AS (
                SELECT e.season_id,
                       home.team_id AS team_id,
                       t.club_id,
                       m.id AS match_id,
                       CASE WHEN home.score > away.score THEN 1 ELSE 0 END AS win,
                       CASE WHEN home.score = away.score THEN 1 ELSE 0 END AS draw,
                       CASE WHEN home.score < away.score THEN 1 ELSE 0 END AS loss,
                       home.score AS goals_for,
                       away.score AS goals_against
                FROM "Match" m
                JOIN "Event" e ON e.id = m.event_id
                JOIN "MatchHomeTeam" home ON home.match_id = m.id
                JOIN "MatchAwayTeam" away ON away.match_id = m.id
                JOIN "Team" t ON t.id = home.team_id
                WHERE m.active = true
                UNION ALL
                SELECT e.season_id,
                       away.team_id,
                       t.club_id,
                       m.id,
                       CASE WHEN away.score > home.score THEN 1 ELSE 0 END,
                       CASE WHEN away.score = home.score THEN 1 ELSE 0 END,
                       CASE WHEN away.score < home.score THEN 1 ELSE 0 END,
                       away.score,
                       home.score
                FROM "Match" m
                JOIN "Event" e ON e.id = m.event_id
                JOIN "MatchHomeTeam" home ON home.match_id = m.id
                JOIN "MatchAwayTeam" away ON away.match_id = m.id
                JOIN "Team" t ON t.id = away.team_id
                WHERE m.active = true
            )
            SELECT s.id AS season_id,
                   s.name AS season_name,
                   t.id AS team_id,
                   t.name AS team_name,
                   c.id AS club_id,
                   c.name AS club_name,
                   COUNT(tr.match_id) AS played,
                   SUM(tr.win) AS wins,
                   SUM(tr.draw) AS draws,
                   SUM(tr.loss) AS losses,
                   SUM(tr.goals_for) AS goals_for,
                   SUM(tr.goals_against) AS goals_against,
                   SUM(tr.goals_for) - SUM(tr.goals_against) AS goal_difference,
                   SUM(tr.win) * 3 + SUM(tr.draw) AS points,
                   (SUM(tr.win)::numeric / NULLIF(COUNT(tr.match_id), 0))::double precision AS win_rate,
                   ((SUM(tr.win) * 3 + SUM(tr.draw))::numeric / NULLIF(COUNT(tr.match_id), 0))::double precision AS points_per_match,
                   DENSE_RANK() OVER (
                       PARTITION BY s.id
                       ORDER BY
                           (SUM(tr.win) * 3 + SUM(tr.draw)) DESC,
                           (SUM(tr.goals_for) - SUM(tr.goals_against)) DESC,
                           SUM(tr.goals_for) DESC
                   ) AS ranking_position
            FROM team_results tr
            JOIN "Season" s ON s.id = tr.season_id
            JOIN "Team" t ON t.id = tr.team_id
            JOIN "Club" c ON c.id = t.club_id
            WHERE (:clubId IS NULL OR c.id = :clubId)
              AND (:seasonId IS NULL OR s.id = :seasonId)
            GROUP BY s.id, s.name, t.id, t.name, c.id, c.name
            ORDER BY s.start_date DESC, points DESC, goal_difference DESC, goals_for DESC
            """;

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> SeasonStandingResponse.builder()
            .seasonId(rs.getLong("season_id"))
            .seasonName(rs.getString("season_name"))
            .teamId(rs.getLong("team_id"))
            .teamName(rs.getString("team_name"))
            .clubId(rs.getLong("club_id"))
            .clubName(rs.getString("club_name"))
            .played(getAsInt(rs, "played"))
            .wins(getAsInt(rs, "wins"))
            .draws(getAsInt(rs, "draws"))
            .losses(getAsInt(rs, "losses"))
            .goalsFor(getAsInt(rs, "goals_for"))
            .goalsAgainst(getAsInt(rs, "goals_against"))
            .goalDifference(getAsInt(rs, "goal_difference"))
            .points(getAsInt(rs, "points"))
            .winRate(getAsDouble(rs, "win_rate"))
            .pointsPerMatch(getAsDouble(rs, "points_per_match"))
            .rankingPosition(getAsInt(rs, "ranking_position"))
            .build());
    }

    public List<ScheduleDensityResponse> findScheduleDensity(ScheduleDensityReportFilter filter) {
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("seasonId", filter.getSeasonId(), Types.BIGINT)
            .addValue("teamId", filter.getTeamId(), Types.BIGINT)
            .addValue("fromDate", filter.getFromDate(), Types.DATE)
            .addValue("toDate", filter.getToDate(), Types.DATE)
            .addValue("alertThresholdDays", filter.getAlertThresholdDays(), Types.INTEGER);

        String sql = """
            WITH team_calendar AS (
                SELECT e.season_id,
                       mt.team_id,
                       t.name AS team_name,
                       m.id AS match_id,
                       m.date AS match_date,
                       m.start_time,
                       m.end_time,
                       ROW_NUMBER() OVER (PARTITION BY e.season_id, mt.team_id ORDER BY m.date, m.id) AS seq
                FROM "Match" m
                JOIN "Event" e ON e.id = m.event_id
                JOIN (
                    SELECT home.match_id, home.team_id FROM "MatchHomeTeam" home
                    UNION ALL
                    SELECT away.match_id, away.team_id FROM "MatchAwayTeam" away
                ) mt ON mt.match_id = m.id
                JOIN "Team" t ON t.id = mt.team_id
                WHERE m.active = true
            ),
            enriched AS (
                SELECT tc.*,
                       LAG(tc.match_date) OVER (PARTITION BY tc.season_id, tc.team_id ORDER BY tc.match_date, tc.match_id) AS previous_match_date,
                       LEAD(tc.match_date) OVER (PARTITION BY tc.season_id, tc.team_id ORDER BY tc.match_date, tc.match_id) AS next_match_date
                FROM team_calendar tc
            )
            SELECT enriched.season_id,
                   s.name AS season_name,
                   enriched.team_id,
                   enriched.team_name,
                   enriched.match_id,
                   enriched.match_date,
                   CASE
                       WHEN enriched.previous_match_date IS NULL THEN NULL
                       ELSE (enriched.match_date - enriched.previous_match_date)
                   END AS rest_days,
                   (SELECT COUNT(*) FROM enriched e2
                    WHERE e2.team_id = enriched.team_id
                      AND e2.season_id = enriched.season_id
                      AND e2.match_date BETWEEN enriched.match_date - INTERVAL '7 day' AND enriched.match_date
                   ) AS matches_last_seven,
                   (SELECT COUNT(*) FROM enriched e3
                    WHERE e3.team_id = enriched.team_id
                      AND e3.season_id = enriched.season_id
                      AND e3.match_date BETWEEN enriched.match_date AND enriched.match_date + INTERVAL '7 day'
                   ) AS matches_next_seven,
                   EXTRACT(EPOCH FROM (COALESCE(enriched.end_time, enriched.start_time) - enriched.start_time)) / 60 AS duration_minutes
            FROM enriched
            JOIN "Season" s ON s.id = enriched.season_id
            WHERE (:seasonId IS NULL OR enriched.season_id = :seasonId)
              AND (:teamId IS NULL OR enriched.team_id = :teamId)
              AND (:fromDate IS NULL OR enriched.match_date >= :fromDate)
              AND (:toDate IS NULL OR enriched.match_date <= :toDate)
            ORDER BY enriched.team_id, enriched.match_date, enriched.match_id
            """;

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> {
            Integer restDays = getAsInt(rs, "rest_days");
            Integer threshold = filter.getAlertThresholdDays();
            Boolean belowThreshold = threshold != null && restDays != null && restDays < threshold;
            return ScheduleDensityResponse.builder()
                .seasonId(rs.getLong("season_id"))
                .seasonName(rs.getString("season_name"))
                .teamId(rs.getLong("team_id"))
                .teamName(rs.getString("team_name"))
                .matchId(rs.getLong("match_id"))
                .matchDate(rs.getObject("match_date", LocalDate.class))
                .restDays(restDays)
                .matchesLastSevenDays(getAsInt(rs, "matches_last_seven"))
                .matchesNextSevenDays(getAsInt(rs, "matches_next_seven"))
                .matchDurationMinutes(getAsInt(rs, "duration_minutes"))
                .belowRestThreshold(belowThreshold)
                .build();
        });
    }

    public List<TeamStaffImpactDetail> findStaffImpactDetails(StaffImpactReportFilter filter) {
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("clubId", filter.getClubId(), Types.BIGINT)
            .addValue("seasonId", filter.getSeasonId(), Types.BIGINT);

        String sql = """
            WITH player_metrics AS (
                SELECT p.team_id,
                       AVG(EXTRACT(YEAR FROM age(CURRENT_DATE, p.birth_date))) AS average_player_age,
                       COUNT(*) AS players,
                       COUNT(*) FILTER (WHERE p.active = true) AS active_players
                FROM "Player" p
                GROUP BY p.team_id
            ),
            staff_metrics AS (
                SELECT s.team_id,
                       COUNT(*) AS staff,
                       AVG(EXTRACT(YEAR FROM age(CURRENT_DATE, s.hire_date))) FILTER (WHERE s.hire_date IS NOT NULL) AS average_staff_tenure
                FROM "Staff" s
                GROUP BY s.team_id
            ),
            match_metrics AS (
                SELECT res.season_id,
                       res.team_id,
                       COUNT(res.match_id) AS matches_played,
                       SUM(res.win) AS wins,
                       SUM(res.draw) AS draws,
                       SUM(res.win) * 3 + SUM(res.draw) AS points,
                       SUM(res.goals_for) AS goals_for,
                       SUM(res.goals_against) AS goals_against
                FROM (
                    SELECT e.season_id,
                           home.team_id,
                           m.id AS match_id,
                           CASE WHEN home.score > away.score THEN 1 ELSE 0 END AS win,
                           CASE WHEN home.score = away.score THEN 1 ELSE 0 END AS draw,
                           home.score AS goals_for,
                           away.score AS goals_against
                    FROM "Match" m
                    JOIN "Event" e ON e.id = m.event_id
                    JOIN "MatchHomeTeam" home ON home.match_id = m.id
                    JOIN "MatchAwayTeam" away ON away.match_id = m.id
                    WHERE m.active = true
                    UNION ALL
                    SELECT e.season_id,
                           away.team_id,
                           m.id,
                           CASE WHEN away.score > home.score THEN 1 ELSE 0 END,
                           CASE WHEN away.score = home.score THEN 1 ELSE 0 END,
                           away.score,
                           home.score
                    FROM "Match" m
                    JOIN "Event" e ON e.id = m.event_id
                    JOIN "MatchHomeTeam" home ON home.match_id = m.id
                    JOIN "MatchAwayTeam" away ON away.match_id = m.id
                    WHERE m.active = true
                ) res
                GROUP BY res.season_id, res.team_id
            )
            SELECT s.id AS season_id,
                   s.name AS season_name,
                   t.id AS team_id,
                   t.name AS team_name,
                   c.id AS club_id,
                   c.name AS club_name,
                   pm.average_player_age,
                 	pm.players,
                   pm.active_players,
                   sm.staff,
                   sm.average_staff_tenure,
                   mm.matches_played,
                   mm.wins,
                   mm.points,
                   (mm.points::numeric / NULLIF(mm.matches_played, 0))::double precision AS points_per_match,
                   (mm.wins::numeric / NULLIF(mm.matches_played, 0))::double precision AS win_rate,
                   (mm.goals_for - mm.goals_against) AS goal_difference
            FROM match_metrics mm
            JOIN "Season" s ON s.id = mm.season_id
            JOIN "Team" t ON t.id = mm.team_id
            JOIN "Club" c ON c.id = t.club_id
            LEFT JOIN player_metrics pm ON pm.team_id = mm.team_id
            LEFT JOIN staff_metrics sm ON sm.team_id = mm.team_id
            WHERE (:clubId IS NULL OR c.id = :clubId)
              AND (:seasonId IS NULL OR s.id = :seasonId)
            """;

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> TeamStaffImpactDetail.builder()
            .seasonId(rs.getLong("season_id"))
            .seasonName(rs.getString("season_name"))
            .teamId(rs.getLong("team_id"))
            .teamName(rs.getString("team_name"))
            .clubId(rs.getLong("club_id"))
            .clubName(rs.getString("club_name"))
            .averagePlayerAge(getAsDouble(rs, "average_player_age"))
            .averageStaffTenure(getAsDouble(rs, "average_staff_tenure"))
            .matchesPlayed(getAsInt(rs, "matches_played"))
            .goalDifference(getAsInt(rs, "goal_difference"))
            .pointsPerMatch(getAsDouble(rs, "points_per_match"))
            .winRate(getAsDouble(rs, "win_rate"))
            .staffToPlayerRatio(calculateRatio(getAsInt(rs, "staff"), getAsInt(rs, "players")))
            .build());
    }

    public List<PaymentMethodPerformanceResponse> findPaymentMethodPerformance(PaymentMethodReportFilter filter) {
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("fromDate", filter.getFromDate(), Types.DATE)
            .addValue("toDate", filter.getToDate(), Types.DATE)
            .addValue("planId", filter.getPlanId(), Types.BIGINT)
            .addValue("currencyId", filter.getCurrencyId(), Types.BIGINT);

        String sql = """
            WITH filtered_payments AS (
                SELECT p.payment_method_id,
                       p.payment_date,
                       p.amount,
                       COALESCE(p.discount, 0) AS discount,
                       p.plan_id,
                       p.roster_id,
                       pm.name AS payment_method_name,
                       (p.amount - COALESCE(p.discount, 0)) AS net_amount
                FROM "Payment" p
                JOIN "PaymentMethod" pm ON pm.id = p.payment_method_id
                WHERE p.active = true
                  AND (:fromDate IS NULL OR p.payment_date::date >= :fromDate)
                  AND (:toDate IS NULL OR p.payment_date::date <= :toDate)
                  AND (:planId IS NULL OR p.plan_id = :planId)
                  AND (:currencyId IS NULL OR p.currency_id = :currencyId)
            ),
            totals AS (
                SELECT COALESCE(SUM(net_amount), 0) AS total_net
                FROM filtered_payments
            )
            SELECT fp.payment_method_id,
                   fp.payment_method_name,
                   COUNT(*) AS total_payments,
                   COUNT(DISTINCT fp.roster_id) AS unique_customers,
                   COUNT(DISTINCT fp.plan_id) AS plans_covered,
                   COALESCE(SUM(fp.amount), 0) AS gross_amount,
                   COALESCE(SUM(fp.discount), 0) AS total_discount,
                   COALESCE(SUM(fp.net_amount), 0) AS net_revenue,
                   COALESCE(SUM(fp.net_amount) / NULLIF(COUNT(*)::numeric, 0::numeric), 0::numeric) AS average_ticket,
                   CASE
                       WHEN t.total_net = 0 THEN 0
                       ELSE SUM(fp.net_amount) / t.total_net * 100
                   END AS revenue_share_percentage,
                   CASE
                       WHEN COALESCE(SUM(fp.amount), 0) = 0 THEN 0
                       ELSE COALESCE(SUM(fp.discount), 0) / SUM(fp.amount) * 100
                   END AS discount_rate_percentage,
                   MIN(fp.payment_date) AS first_payment_date,
                   MAX(fp.payment_date) AS last_payment_date
            FROM filtered_payments fp
            CROSS JOIN totals t
            GROUP BY fp.payment_method_id, fp.payment_method_name, t.total_net
            ORDER BY net_revenue DESC, fp.payment_method_name
            """;

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> {
            Timestamp firstPayment = rs.getTimestamp("first_payment_date");
            Timestamp lastPayment = rs.getTimestamp("last_payment_date");
            return PaymentMethodPerformanceResponse.builder()
                .paymentMethodId(rs.getLong("payment_method_id"))
                .paymentMethodName(rs.getString("payment_method_name"))
                .totalPayments(getAsLong(rs, "total_payments"))
                .uniqueCustomers(getAsLong(rs, "unique_customers"))
                .plansCovered(getAsInt(rs, "plans_covered"))
                .grossAmount(rs.getBigDecimal("gross_amount"))
                .totalDiscount(rs.getBigDecimal("total_discount"))
                .netRevenue(rs.getBigDecimal("net_revenue"))
                .averageTicket(rs.getBigDecimal("average_ticket"))
                .revenueSharePercentage(getAsDouble(rs, "revenue_share_percentage"))
                .discountRatePercentage(getAsDouble(rs, "discount_rate_percentage"))
                .firstPaymentDate(firstPayment != null ? firstPayment.toLocalDateTime() : null)
                .lastPaymentDate(lastPayment != null ? lastPayment.toLocalDateTime() : null)
                .build();
        });
    }

    public List<SubscriptionPlanPerformanceResponse> findSubscriptionPlanPerformance(SubscriptionPlanReportFilter filter) {
        MapSqlParameterSource params = new MapSqlParameterSource()
            .addValue("planId", filter.getPlanId(), Types.BIGINT)
            .addValue("statusId", filter.getStatusId(), Types.BIGINT)
            .addValue("fromDate", filter.getFromDate(), Types.DATE)
            .addValue("toDate", filter.getToDate(), Types.DATE)
            .addValue("referenceDate", filter.getReferenceDate(), Types.DATE)
            .addValue("renewalHorizonDays", filter.getRenewalHorizonDays(), Types.INTEGER)
            .addValue("churnWindowDays", filter.getChurnWindowDays(), Types.INTEGER);

        String sql = """
            WITH plan_base AS (
                SELECT p.id AS plan_id,
                       p.name AS plan_name,
                       p.price AS plan_price
                FROM "Plan" p
            ),
            subscription_data AS (
                SELECT s.plan_id,
                       s.active,
                       s.status_id,
                       s.end_date,
                       ss.name AS status_name,
                       CASE
                           WHEN s.end_date BETWEEN :referenceDate AND (:referenceDate + make_interval(days => COALESCE(:renewalHorizonDays, 0)))
                                AND COALESCE(ss.name, 'ACTIVE') IN ('ACTIVE', 'TRIAL')
                               THEN 1 ELSE 0
                       END AS renewal_flag,
                       CASE
                           WHEN s.end_date BETWEEN (:referenceDate - make_interval(days => COALESCE(:churnWindowDays, 0))) AND :referenceDate
                                AND COALESCE(ss.name, 'INACTIVE') IN ('INACTIVE', 'SUSPENDED')
                               THEN 1 ELSE 0
                       END AS churn_flag
                FROM "Subscription" s
                LEFT JOIN "SubscriptionStatus" ss ON ss.id = s.status_id
                WHERE (:planId IS NULL OR s.plan_id = :planId)
                  AND (:statusId IS NULL OR s.status_id = :statusId)
            ),
            aggregated_subs AS (
                SELECT sd.plan_id,
                       COUNT(*) AS total_subscriptions,
                       COUNT(*) FILTER (
                           WHERE COALESCE(sd.status_name, 'ACTIVE') = 'ACTIVE' OR sd.active = true
                       ) AS active_subscriptions,
                       COUNT(*) FILTER (WHERE sd.status_name = 'TRIAL') AS trial_subscriptions,
                       COUNT(*) FILTER (WHERE sd.status_name = 'SUSPENDED') AS suspended_subscriptions,
                       COUNT(*) FILTER (WHERE sd.status_name = 'INACTIVE') AS inactive_subscriptions,
                       SUM(sd.renewal_flag) AS upcoming_renewals,
                       SUM(sd.churn_flag) AS churned_recently
                FROM subscription_data sd
                GROUP BY sd.plan_id
            ),
            payment_data AS (
                SELECT p.plan_id,
                       COUNT(*) AS payments_count,
                       COALESCE(SUM(p.amount), 0) AS gross_revenue,
                       COALESCE(SUM(p.discount), 0) AS total_discount,
                       COALESCE(SUM(p.amount - COALESCE(p.discount, 0)), 0) AS net_revenue
                FROM "Payment" p
                WHERE p.active = true
                  AND (:planId IS NULL OR p.plan_id = :planId)
                  AND (:fromDate IS NULL OR p.payment_date::date >= :fromDate)
                  AND (:toDate IS NULL OR p.payment_date::date <= :toDate)
                GROUP BY p.plan_id
            )
            SELECT pb.plan_id,
                   pb.plan_name,
                   pb.plan_price,
                   COALESCE(asubs.total_subscriptions, 0) AS total_subscriptions,
                   COALESCE(asubs.active_subscriptions, 0) AS active_subscriptions,
                   COALESCE(asubs.trial_subscriptions, 0) AS trial_subscriptions,
                   COALESCE(asubs.suspended_subscriptions, 0) AS suspended_subscriptions,
                   COALESCE(asubs.inactive_subscriptions, 0) AS inactive_subscriptions,
                   COALESCE(asubs.upcoming_renewals, 0) AS upcoming_renewals,
                   COALESCE(asubs.churned_recently, 0) AS churned_recently,
                   COALESCE(pdata.payments_count, 0) AS payments_count,
                   COALESCE(pdata.gross_revenue, 0) AS gross_revenue,
                   COALESCE(pdata.total_discount, 0) AS total_discount,
                   COALESCE(pdata.net_revenue, 0) AS net_revenue,
                   CASE
                       WHEN COALESCE(asubs.total_subscriptions, 0) = 0 THEN 0
                       ELSE COALESCE(asubs.active_subscriptions, 0) * 100.0 / asubs.total_subscriptions
                   END AS retention_rate_percentage,
                   COALESCE(
                       pdata.net_revenue / NULLIF(asubs.total_subscriptions::numeric, 0::numeric),
                       0::numeric
                   ) AS average_revenue_per_subscription,
                   COALESCE(
                       pdata.net_revenue / NULLIF(asubs.active_subscriptions::numeric, 0::numeric),
                       0::numeric
                   ) AS arpu
            FROM plan_base pb
            LEFT JOIN aggregated_subs asubs ON asubs.plan_id = pb.plan_id
            LEFT JOIN payment_data pdata ON pdata.plan_id = pb.plan_id
            WHERE (:planId IS NULL OR pb.plan_id = :planId)
              AND (COALESCE(asubs.total_subscriptions, 0) > 0 OR COALESCE(pdata.payments_count, 0) > 0)
            ORDER BY COALESCE(pdata.net_revenue, 0) DESC, pb.plan_name
            """;

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> SubscriptionPlanPerformanceResponse.builder()
            .planId(rs.getLong("plan_id"))
            .planName(rs.getString("plan_name"))
            .planPrice(rs.getBigDecimal("plan_price"))
            .totalSubscriptions(getAsInt(rs, "total_subscriptions"))
            .activeSubscriptions(getAsInt(rs, "active_subscriptions"))
            .trialSubscriptions(getAsInt(rs, "trial_subscriptions"))
            .suspendedSubscriptions(getAsInt(rs, "suspended_subscriptions"))
            .inactiveSubscriptions(getAsInt(rs, "inactive_subscriptions"))
            .upcomingRenewals(getAsInt(rs, "upcoming_renewals"))
            .churnedRecently(getAsInt(rs, "churned_recently"))
            .paymentsCount(getAsInt(rs, "payments_count"))
            .grossRevenue(rs.getBigDecimal("gross_revenue"))
            .totalDiscount(rs.getBigDecimal("total_discount"))
            .netRevenue(rs.getBigDecimal("net_revenue"))
            .averageRevenuePerSubscription(rs.getBigDecimal("average_revenue_per_subscription"))
            .arpu(rs.getBigDecimal("arpu"))
            .retentionRatePercentage(getAsDouble(rs, "retention_rate_percentage"))
            .build());
    }

    private List<PhysicalStateBreakdown> parsePhysicalStates(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(json, PHYSICAL_STATE_TYPE);
        } catch (JsonProcessingException e) {
            log.warn("Error parsing physical state json: {}", json, e);
            return Collections.emptyList();
        }
    }

    private List<StaffRoleBreakdown> parseRoleBreakdown(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(json, STAFF_ROLE_TYPE);
        } catch (JsonProcessingException e) {
            log.warn("Error parsing staff role json: {}", json, e);
            return Collections.emptyList();
        }
    }

    private Integer getAsInt(ResultSet rs, String column) throws SQLException {
        Number value = (Number) rs.getObject(column);
        return value != null ? value.intValue() : null;
    }

    private Long getAsLong(ResultSet rs, String column) throws SQLException {
        Number value = (Number) rs.getObject(column);
        return value != null ? value.longValue() : null;
    }

    private Double getAsDouble(ResultSet rs, String column) throws SQLException {
        Number value = (Number) rs.getObject(column);
        return value != null ? value.doubleValue() : null;
    }

    private Double calculateRatio(Integer numerator, Integer denominator) {
        if (numerator == null || denominator == null || denominator == 0) {
            return null;
        }
        return numerator.doubleValue() / denominator.doubleValue();
    }
}
