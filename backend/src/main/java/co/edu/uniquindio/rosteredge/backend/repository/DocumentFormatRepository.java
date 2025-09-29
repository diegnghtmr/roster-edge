package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.DocumentFormat;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentFormatRepository extends BaseRepository<DocumentFormat, Long> {

    @Query("SELECT * FROM \"DocumentFormat\" WHERE (:name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:active IS NULL OR active = :active)")
    List<DocumentFormat> findByFilters(@Param("name") String name,
                                       @Param("active") Boolean active);
}

