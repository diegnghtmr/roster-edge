package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Player;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Player entity
 */
@Repository
public interface PlayerRepository extends BaseRepository<Player, Long> {
    
    @Query("SELECT * FROM players WHERE team_id = :teamId")
    List<Player> findByTeamId(@Param("teamId") Long teamId);
    
    @Query("SELECT * FROM players WHERE position = :position")
    List<Player> findByPosition(@Param("position") String position);
    
    @Query("SELECT * FROM players WHERE active = true")
    List<Player> findByActiveTrue();
    
    @Query("SELECT * FROM players WHERE jersey_number = :number AND team_id = :teamId")
    List<Player> findByJerseyNumberAndTeamId(@Param("number") Integer number, @Param("teamId") Long teamId);
}
