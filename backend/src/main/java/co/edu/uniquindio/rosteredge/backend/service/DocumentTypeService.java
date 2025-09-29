package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.DocumentType;

import java.util.List;

public interface DocumentTypeService extends CrudService<DocumentType> {

    List<DocumentType> findByFilters(String name, Boolean active);
}
