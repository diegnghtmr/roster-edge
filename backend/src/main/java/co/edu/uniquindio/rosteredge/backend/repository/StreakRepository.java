package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Streak;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StreakRepository extends BaseRepository<Streak, Long> {

    @Query("SELECT * FROM \"Streak\" WHERE (:teamId IS NULL OR team_id = :teamId) " +
           "AND (:active IS NULL OR active = :active) " +
           "AND (:startFrom IS NULL OR start_date >= :startFrom) " +
           "AND (:startTo IS NULL OR start_date <= :startTo) " +
           "AND (:endFrom IS NULL OR end_date >= :endFrom) " +
           "AND (:endTo IS NULL OR end_date <= :endTo)")
    List<Streak> findByFilters(@Param("teamId") Long teamId,
                               @Param("active") Boolean active,
                               @Param("startFrom") LocalDate startFrom,
                               @Param("startTo") LocalDate startTo,
                               @Param("endFrom") LocalDate endFrom,
                               @Param("endTo") LocalDate endTo);
}

