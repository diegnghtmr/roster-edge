package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.TeamColor;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamColorRepository extends BaseRepository<TeamColor, Long> {

    @Query("SELECT * FROM \"TeamColor\" WHERE (:teamId IS NULL OR team_id = :teamId) " +
           "AND (:colorId IS NULL OR color_id = :colorId) " +
           "AND (:active IS NULL OR active = :active)")
    List<TeamColor> findByFilters(@Param("teamId") Long teamId,
                                  @Param("colorId") Long colorId,
                                  @Param("active") Boolean active);
}

