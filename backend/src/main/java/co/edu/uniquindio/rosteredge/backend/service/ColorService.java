package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Color;

import java.util.List;

public interface ColorService extends CrudService<Color> {

    List<Color> findByFilters(String name, Boolean active);
}
