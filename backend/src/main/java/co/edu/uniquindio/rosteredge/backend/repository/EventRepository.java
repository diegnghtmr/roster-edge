package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Event;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends BaseRepository<Event, Long> {

    @Override
    @Query("SELECT * FROM \"Event\"")
    List<Event> findAll();

    @Query("SELECT * FROM \"Event\" WHERE (:seasonId IS NULL OR season_id = :seasonId) " +
           "AND (:venueId IS NULL OR venue_id = :venueId) " +
           "AND (:active IS NULL OR active = :active) " +
           "AND (:dateFrom IS NULL OR date >= :dateFrom) " +
           "AND (:dateTo IS NULL OR date <= :dateTo)")
    List<Event> findByFilters(@Param("seasonId") Long seasonId,
                              @Param("venueId") Long venueId,
                              @Param("active") Boolean active,
                              @Param("dateFrom") LocalDate dateFrom,
                              @Param("dateTo") LocalDate dateTo);
}
