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
           "AND (:name IS NULL OR LOWER(name) LIKE LOWER('%' || :name || '%')) " +
           "AND (:description IS NULL OR LOWER(description) LIKE LOWER('%' || :description || '%')) " +
           "AND (:venueId IS NULL OR venue_id = :venueId) " +
           "AND (:active IS NULL OR active = :active) " +
           "AND (CAST(:dateFrom AS DATE) IS NULL OR date >= CAST(:dateFrom AS DATE)) " +
           "AND (CAST(:dateTo AS DATE) IS NULL OR date <= CAST(:dateTo AS DATE))")
    List<Event> findByFilters(@Param("seasonId") Long seasonId,
                              @Param("name") String name,
                              @Param("description") String description,
                              @Param("venueId") Long venueId,
                              @Param("active") Boolean active,
                              @Param("dateFrom") LocalDate dateFrom,
                              @Param("dateTo") LocalDate dateTo);
}
