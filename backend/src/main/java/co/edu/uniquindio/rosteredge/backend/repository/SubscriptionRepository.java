package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Subscription;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SubscriptionRepository extends BaseRepository<Subscription, Long> {

    @Query("SELECT * FROM \"Subscription\" WHERE (:planId IS NULL OR plan_id = :planId) " +
           "AND (:statusId IS NULL OR status_id = :statusId) " +
           "AND (:active IS NULL OR active = :active) " +
           "AND (:startDateFrom IS NULL OR start_date >= :startDateFrom) " +
           "AND (:startDateTo IS NULL OR start_date <= :startDateTo) " +
           "AND (:endDateFrom IS NULL OR end_date >= :endDateFrom) " +
           "AND (:endDateTo IS NULL OR end_date <= :endDateTo)")
    List<Subscription> findByFilters(@Param("planId") Long planId,
                                     @Param("statusId") Long statusId,
                                     @Param("active") Boolean active,
                                     @Param("startDateFrom") LocalDate startDateFrom,
                                     @Param("startDateTo") LocalDate startDateTo,
                                     @Param("endDateFrom") LocalDate endDateFrom,
                                     @Param("endDateTo") LocalDate endDateTo);
}

