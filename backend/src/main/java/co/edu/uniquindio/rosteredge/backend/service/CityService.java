package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.City;

import java.util.List;

public interface CityService extends CrudService<City> {

    List<City> findByFilters(Long countryId, String name, Boolean active);
}
