package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.RosterDocumentTemplate;

import java.util.List;

public interface RosterDocumentTemplateService extends CrudService<RosterDocumentTemplate> {

    List<RosterDocumentTemplate> findByFilters(Long rosterId, Long documentTemplateId, Boolean active);
}

