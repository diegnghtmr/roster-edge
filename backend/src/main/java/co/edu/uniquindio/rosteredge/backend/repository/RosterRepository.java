package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Roster;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RosterRepository extends BaseRepository<Roster, Long> {
    Optional<Roster> findByEmail(String email);

    @Query("SELECT * FROM \"Roster\" WHERE (:clubId IS NULL OR club_id = :clubId) " +
           "AND (:subscriptionId IS NULL OR subscription_id = :subscriptionId) " +
           "AND (:active IS NULL OR active = :active) " +
           "AND (:name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:email IS NULL OR LOWER(email) LIKE LOWER(CONCAT('%', :email, '%'))) " +
           "AND (CAST(:creationFrom AS DATE) IS NULL OR creation_date >= CAST(:creationFrom AS DATE)) " +
           "AND (CAST(:creationTo AS DATE) IS NULL OR creation_date <= CAST(:creationTo AS DATE)) " +
           "AND (CAST(:lastAccessFrom AS DATE) IS NULL OR last_access >= CAST(:lastAccessFrom AS DATE)) " +
           "AND (CAST(:lastAccessTo AS DATE) IS NULL OR last_access <= CAST(:lastAccessTo AS DATE))")
    List<Roster> findByFilters(@Param("clubId") Long clubId,
                               @Param("subscriptionId") Long subscriptionId,
                               @Param("active") Boolean active,
                               @Param("name") String name,
                               @Param("email") String email,
                               @Param("creationFrom") LocalDate creationFrom,
                               @Param("creationTo") LocalDate creationTo,
                               @Param("lastAccessFrom") LocalDate lastAccessFrom,
                               @Param("lastAccessTo") LocalDate lastAccessTo);
}




