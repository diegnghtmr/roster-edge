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

    List<Player> findByTeamId(@Param("teamId") Long teamId);

    List<Player> findByPrimaryPositionId(@Param("primaryPositionId") Long primaryPositionId);

    @Query("SELECT * FROM \"Player\" WHERE active = true")
    List<Player> findByActiveTrue();

    List<Player> findByJerseyNumberAndTeamId(@Param("number") String number, @Param("teamId") Long teamId);
}
