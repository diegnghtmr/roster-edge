package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.RosterDocumentTemplate;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RosterDocumentTemplateRepository extends BaseRepository<RosterDocumentTemplate, Long> {

    @Query("SELECT * FROM \"RosterDocumentTemplate\" WHERE (:rosterId IS NULL OR roster_id = :rosterId) " +
           "AND (:documentTemplateId IS NULL OR document_template_id = :documentTemplateId) " +
           "AND (:active IS NULL OR active = :active)")
    List<RosterDocumentTemplate> findByFilters(@Param("rosterId") Long rosterId,
                                               @Param("documentTemplateId") Long documentTemplateId,
                                               @Param("active") Boolean active);
}

