package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Season;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SeasonRepository extends BaseRepository<Season, Long> {

    @Query("SELECT * FROM \"Season\" WHERE (:clubId IS NULL OR club_id = :clubId) " +
           "AND (:name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:active IS NULL OR active = :active) " +
           "AND (:startFrom IS NULL OR start_date >= :startFrom) " +
           "AND (:startTo IS NULL OR start_date <= :startTo) " +
           "AND (:endFrom IS NULL OR end_date >= :endFrom) " +
           "AND (:endTo IS NULL OR end_date <= :endTo)")
    List<Season> findByFilters(@Param("clubId") Long clubId,
                               @Param("name") String name,
                               @Param("active") Boolean active,
                               @Param("startFrom") LocalDate startFrom,
                               @Param("startTo") LocalDate startTo,
                               @Param("endFrom") LocalDate endFrom,
                               @Param("endTo") LocalDate endTo);
}
