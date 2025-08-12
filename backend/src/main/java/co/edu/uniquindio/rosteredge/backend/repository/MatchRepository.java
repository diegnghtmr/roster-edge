package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Match;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Match entity
 */
@Repository
public interface MatchRepository extends BaseRepository<Match, Long> {
    
    @Query("SELECT * FROM matches WHERE home_team_id = :teamId OR away_team_id = :teamId")
    List<Match> findByTeamId(@Param("teamId") Long teamId);
    
    @Query("SELECT * FROM matches WHERE status = :status")
    List<Match> findByStatus(@Param("status") String status);
    
    @Query("SELECT * FROM matches WHERE match_date BETWEEN :startDate AND :endDate")
    List<Match> findByMatchDateBetween(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT * FROM matches WHERE active = true")
    List<Match> findByActiveTrue();
}
