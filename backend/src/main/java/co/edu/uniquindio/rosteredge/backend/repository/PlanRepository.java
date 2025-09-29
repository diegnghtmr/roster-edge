package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Plan;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PlanRepository extends BaseRepository<Plan, Long> {

    @Query("SELECT * FROM \"Plan\" WHERE (:name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:active IS NULL OR active = :active) " +
           "AND (:priceFrom IS NULL OR price >= :priceFrom) " +
           "AND (:priceTo IS NULL OR price <= :priceTo)")
    List<Plan> findByFilters(@Param("name") String name,
                             @Param("active") Boolean active,
                             @Param("priceFrom") BigDecimal priceFrom,
                             @Param("priceTo") BigDecimal priceTo);
}

