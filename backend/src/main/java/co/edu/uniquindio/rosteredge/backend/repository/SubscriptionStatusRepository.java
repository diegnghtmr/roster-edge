package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.SubscriptionStatus;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionStatusRepository extends BaseRepository<SubscriptionStatus, Long> {

    @Query("SELECT * FROM \"SubscriptionStatus\" WHERE (:name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:active IS NULL OR active = :active)")
    List<SubscriptionStatus> findByFilters(@Param("name") String name,
                                           @Param("active") Boolean active);
}

