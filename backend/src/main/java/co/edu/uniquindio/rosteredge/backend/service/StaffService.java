package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Staff;

import java.util.List;

public interface StaffService extends CrudService<Staff> {

    List<Staff> findByFilters(Long teamId, Long staffRoleId, Boolean active);
}
