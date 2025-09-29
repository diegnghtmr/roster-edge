package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.ClubEvent;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClubEventRepository extends BaseRepository<ClubEvent, Long> {

    @Query("SELECT * FROM \"ClubEvent\" WHERE (:clubId IS NULL OR club_id = :clubId) " +
           "AND (:eventId IS NULL OR event_id = :eventId) " +
           "AND (:active IS NULL OR active = :active)")
    List<ClubEvent> findByFilters(@Param("clubId") Long clubId,
                                  @Param("eventId") Long eventId,
                                  @Param("active") Boolean active);
}

