package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.DocumentTemplate;

import java.time.LocalDateTime;
import java.util.List;

public interface DocumentTemplateService extends CrudService<DocumentTemplate> {

    List<DocumentTemplate> findByFilters(String name, Long documentFormatId, Long documentTypeId,
                                         Boolean active, LocalDateTime creationFrom, LocalDateTime creationTo);
}

