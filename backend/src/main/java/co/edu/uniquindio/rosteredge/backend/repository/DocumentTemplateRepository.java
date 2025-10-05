package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.DocumentTemplate;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DocumentTemplateRepository extends BaseRepository<DocumentTemplate, Long> {

    @Query("SELECT * FROM \"DocumentTemplate\" WHERE (:name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:formatId IS NULL OR document_format_id = :formatId) " +
            "AND (:typeId IS NULL OR document_type_id = :typeId) " +
            "AND (:active IS NULL OR active = :active) " +
            "AND (CAST(:createdFrom AS timestamp) IS NULL OR creation >= :createdFrom) " +
            "AND (CAST(:createdTo AS timestamp) IS NULL OR creation <= :createdTo)")
    List<DocumentTemplate> findByFilters(@Param("name") String name,
                                         @Param("formatId") Long documentFormatId,
                                         @Param("typeId") Long documentTypeId,
                                         @Param("active") Boolean active,
                                         @Param("createdFrom") LocalDateTime creationFrom,
                                         @Param("createdTo") LocalDateTime creationTo);
}

