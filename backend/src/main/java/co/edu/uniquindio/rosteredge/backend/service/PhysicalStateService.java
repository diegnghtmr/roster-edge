package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.PhysicalState;

import java.util.List;

public interface PhysicalStateService extends CrudService<PhysicalState> {

    List<PhysicalState> findByFilters(String name, Boolean active);
}

