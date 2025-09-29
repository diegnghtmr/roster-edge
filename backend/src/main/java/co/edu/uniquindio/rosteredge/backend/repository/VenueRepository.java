package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Venue;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VenueRepository extends BaseRepository<Venue, Long> {

    @Query("SELECT * FROM \"Venue\" WHERE (:clubId IS NULL OR club_id = :clubId) " +
           "AND (:cityId IS NULL OR city_id = :cityId) " +
           "AND (:active IS NULL OR active = :active) " +
           "AND (:name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:email IS NULL OR LOWER(email) LIKE LOWER(CONCAT('%', :email, '%'))) " +
           "AND (:foundationFrom IS NULL OR foundation >= :foundationFrom) " +
           "AND (:foundationTo IS NULL OR foundation <= :foundationTo)")
    List<Venue> findByFilters(@Param("clubId") Long clubId,
                              @Param("cityId") Long cityId,
                              @Param("active") Boolean active,
                              @Param("name") String name,
                              @Param("email") String email,
                              @Param("foundationFrom") LocalDate foundationFrom,
                              @Param("foundationTo") LocalDate foundationTo);
}

