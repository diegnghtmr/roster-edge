package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.PlayerPosition;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerPositionRepository extends BaseRepository<PlayerPosition, Long> {

    @Query("SELECT * FROM \"PlayerPosition\" WHERE (:name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:active IS NULL OR active = :active)")
    List<PlayerPosition> findByFilters(@Param("name") String name,
                                       @Param("active") Boolean active);
}

