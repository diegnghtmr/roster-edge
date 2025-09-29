package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.StaffRole;

import java.util.List;

public interface StaffRoleService extends CrudService<StaffRole> {

    List<StaffRole> findByFilters(String name, Boolean active);
}
