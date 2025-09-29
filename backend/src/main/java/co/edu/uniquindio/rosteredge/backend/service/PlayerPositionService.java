package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.PlayerPosition;

import java.util.List;

public interface PlayerPositionService extends CrudService<PlayerPosition> {

    List<PlayerPosition> findByFilters(String name, Boolean active);
}

