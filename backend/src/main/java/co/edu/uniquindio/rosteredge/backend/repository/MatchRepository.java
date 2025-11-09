package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Match;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository for Match entity
 */
@Repository
public interface MatchRepository extends BaseRepository<Match, Long> {
    @Query(
        "SELECT m.* FROM \"Match\" m " +
            "LEFT JOIN \"MatchHomeTeam\" mht ON m.id = mht.match_id " +
            "LEFT JOIN \"MatchAwayTeam\" mat ON m.id = mat.match_id " +
            "WHERE (mht.team_id = :teamId OR mat.team_id = :teamId) AND m.active = true"
    )
    List<Match> findByTeamId(@Param("teamId") Long teamId);

    @Query(
        "SELECT * FROM \"Match\" WHERE date BETWEEN :startDate AND :endDate AND active = true"
    )
    List<Match> findByDateBetween(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    @Query("SELECT * FROM \"Match\" WHERE active = true")
    List<Match> findByActiveTrue();

    @Query(
        "SELECT DISTINCT m.*, e.season_id AS season_id FROM \"Match\" m " +
            "JOIN \"Event\" e ON m.event_id = e.id " +
            "LEFT JOIN \"MatchHomeTeam\" mht ON m.id = mht.match_id " +
            "LEFT JOIN \"MatchAwayTeam\" mat ON m.id = mat.match_id " +
            "WHERE (:eventId IS NULL OR e.id = :eventId) " +
            "AND (:matchdayId IS NULL OR m.matchday_id = :matchdayId) " +
            "AND (:stadiumId IS NULL OR m.stadium_id = :stadiumId) " +
            "AND (:teamId IS NULL OR mht.team_id = :teamId OR mat.team_id = :teamId) " +
            "AND (:active IS NULL OR m.active = :active) " +
            "AND (CAST(:dateFrom AS DATE) IS NULL OR m.date >= CAST(:dateFrom AS DATE)) " +
            "AND (CAST(:dateTo AS DATE) IS NULL OR m.date <= CAST(:dateTo AS DATE))"
    )
    List<Match> findByFilters(
        @Param("eventId") Long eventId,
        @Param("matchdayId") Long matchdayId,
        @Param("stadiumId") Long stadiumId,
        @Param("teamId") Long teamId,
        @Param("active") Boolean active,
        @Param("dateFrom") LocalDate dateFrom,
        @Param("dateTo") LocalDate dateTo
    );
}
