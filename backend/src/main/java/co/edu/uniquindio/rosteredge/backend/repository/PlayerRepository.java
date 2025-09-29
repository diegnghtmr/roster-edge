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

    @Override
    @Query("SELECT * FROM \"Player\"")
    List<Player> findAll();

    @Query("SELECT * FROM \"Player\" WHERE (:teamId IS NULL OR team_id = :teamId) " +
           "AND (:positionId IS NULL OR primary_position_id = :positionId) " +
           "AND (:active IS NULL OR active = :active)")
    List<Player> findByFilters(@Param("teamId") Long teamId,
                               @Param("positionId") Long primaryPositionId,
                               @Param("active") Boolean active);
}
