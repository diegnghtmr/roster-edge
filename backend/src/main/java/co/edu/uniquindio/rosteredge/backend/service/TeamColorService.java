package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.TeamColor;

import java.util.List;

public interface TeamColorService extends CrudService<TeamColor> {

    List<TeamColor> findByFilters(Long teamId, Long colorId, Boolean active);
}

