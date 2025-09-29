package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.MatchHomeTeam;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchHomeTeamRepository extends BaseRepository<MatchHomeTeam, Long> {

    @Query("SELECT * FROM \"MatchHomeTeam\" WHERE (:matchId IS NULL OR match_id = :matchId) " +
           "AND (:teamId IS NULL OR team_id = :teamId) " +
           "AND (:active IS NULL OR active = :active)")
    List<MatchHomeTeam> findByFilters(@Param("matchId") Long matchId,
                                      @Param("teamId") Long teamId,
                                      @Param("active") Boolean active);
}

