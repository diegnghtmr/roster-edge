package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Venue;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VenueRepository extends BaseRepository<Venue, Long> {

    @Query("SELECT * FROM \"Venue\" WHERE (:name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:email IS NULL OR LOWER(email) LIKE LOWER(CONCAT('%', :email, '%'))) " +
           "AND (:cityId IS NULL OR city_id = :cityId) " +
           "AND (:clubId IS NULL OR club_id = :clubId) " +
           "AND (:active IS NULL OR active = :active) " +
           "AND (CAST(:foundationFrom AS DATE) IS NULL OR foundation >= CAST(:foundationFrom AS DATE)) " +
           "AND (CAST(:foundationTo AS DATE) IS NULL OR foundation <= CAST(:foundationTo AS DATE))")
    List<Venue> findByFilters(@Param("name") String name,
                              @Param("email") String email,
                              @Param("cityId") Long cityId,
                              @Param("clubId") Long clubId,
                              @Param("active") Boolean active,
                              @Param("foundationFrom") LocalDate foundationFrom,
                              @Param("foundationTo") LocalDate foundationTo);
}