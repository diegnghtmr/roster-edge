package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Club;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ClubRepository extends BaseRepository<Club, Long> {

    @Query("SELECT * FROM \"Club\" WHERE (:name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:active IS NULL OR active = :active) " +
           "AND (:foundationFrom IS NULL OR foundation >= :foundationFrom) " +
           "AND (:foundationTo IS NULL OR foundation <= :foundationTo)")
    List<Club> findByFilters(@Param("name") String name,
                             @Param("active") Boolean active,
                             @Param("foundationFrom") LocalDate foundationFrom,
                             @Param("foundationTo") LocalDate foundationTo);
}
