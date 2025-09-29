package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Matchday;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchdayRepository extends BaseRepository<Matchday, Long> {

    @Query("SELECT * FROM \"Matchday\" WHERE (:name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:active IS NULL OR active = :active)")
    List<Matchday> findByFilters(@Param("name") String name,
                                 @Param("active") Boolean active);
}

