package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Stadium;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface StadiumRepository extends BaseRepository<Stadium, Long> {

    @Query("SELECT * FROM \"Stadium\" WHERE (:venueId IS NULL OR venue_id = :venueId) " +
           "AND (:surface IS NULL OR LOWER(surface) LIKE LOWER(CONCAT('%', :surface, '%'))) " +
           "AND (:active IS NULL OR active = :active) " +
           "AND (:capacityFrom IS NULL OR total_capacity >= :capacityFrom) " +
           "AND (:capacityTo IS NULL OR total_capacity <= :capacityTo) " +
           "AND (:foundationFrom IS NULL OR foundation >= :foundationFrom) " +
           "AND (:foundationTo IS NULL OR foundation <= :foundationTo) " +
           "AND (:areaFrom IS NULL OR area >= :areaFrom) " +
           "AND (:areaTo IS NULL OR area <= :areaTo)")
    List<Stadium> findByFilters(@Param("venueId") Long venueId,
                                @Param("surface") String surface,
                                @Param("active") Boolean active,
                                @Param("capacityFrom") Integer capacityFrom,
                                @Param("capacityTo") Integer capacityTo,
                                @Param("foundationFrom") java.time.LocalDate foundationFrom,
                                @Param("foundationTo") java.time.LocalDate foundationTo,
                                @Param("areaFrom") BigDecimal areaFrom,
                                @Param("areaTo") BigDecimal areaTo);
}

