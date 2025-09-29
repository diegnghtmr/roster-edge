package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.PlanBenefit;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanBenefitRepository extends BaseRepository<PlanBenefit, Long> {

    @Query("SELECT * FROM \"PlanBenefit\" WHERE (:planId IS NULL OR plan_id = :planId) " +
           "AND (:description IS NULL OR LOWER(description) LIKE LOWER(CONCAT('%', :description, '%'))) " +
           "AND (:active IS NULL OR active = :active)")
    List<PlanBenefit> findByFilters(@Param("planId") Long planId,
                                    @Param("description") String description,
                                    @Param("active") Boolean active);
}

