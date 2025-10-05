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
           "AND (CAST(:startFrom AS DATE) IS NULL OR start_date >= CAST(:startFrom AS DATE)) " +
           "AND (CAST(:startTo AS DATE) IS NULL OR start_date <= CAST(:startTo AS DATE)) " +
           "AND (CAST(:endFrom AS DATE) IS NULL OR end_date >= CAST(:endFrom AS DATE)) " +
           "AND (CAST(:endTo AS DATE) IS NULL OR end_date <= CAST(:endTo AS DATE))")
    List<Streak> findByFilters(@Param("teamId") Long teamId,
                               @Param("active") Boolean active,
                               @Param("startFrom") LocalDate startFrom,
                               @Param("startTo") LocalDate startTo,
                               @Param("endFrom") LocalDate endFrom,
                               @Param("endTo") LocalDate endTo);
}

