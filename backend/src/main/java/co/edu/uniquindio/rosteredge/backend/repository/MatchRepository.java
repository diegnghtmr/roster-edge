package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Match;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for Match entity
 */
@Repository
public interface MatchRepository extends BaseRepository<Match, Long> {

    @Query("SELECT m.* FROM \"Match\" m " +
           "LEFT JOIN \"MatchHomeTeam\" mht ON m.id = mht.match_id " +
           "LEFT JOIN \"MatchAwayTeam\" mat ON m.id = mat.match_id " +
           "WHERE mht.team_id = :teamId OR mat.team_id = :teamId")
    List<Match> findByTeamId(@Param("teamId") Long teamId);

    @Query("SELECT * FROM \"Match\" WHERE date BETWEEN :startDate AND :endDate")
    List<Match> findByDateBetween(@Param("startDate") LocalDate startDate,
                                  @Param("endDate") LocalDate endDate);

    @Query("SELECT * FROM \"Match\" WHERE active = true")
    List<Match> findByActiveTrue();
}
