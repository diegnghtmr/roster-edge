package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.DocumentFormat;

import java.util.List;

public interface DocumentFormatService extends CrudService<DocumentFormat> {

    List<DocumentFormat> findByFilters(String name, Boolean active);
}
