package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.TeamCategory;

import java.util.List;

public interface TeamCategoryService extends CrudService<TeamCategory> {

    List<TeamCategory> findByFilters(String name, Boolean active);
}

