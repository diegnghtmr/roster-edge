package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Country;

import java.util.List;

public interface CountryService extends CrudService<Country> {

    List<Country> findByFilters(String name, Boolean active);
}
