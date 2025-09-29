package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.StaffRole;
import co.edu.uniquindio.rosteredge.backend.repository.StaffRoleRepository;
import co.edu.uniquindio.rosteredge.backend.service.StaffRoleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StaffRoleServiceImpl extends SimpleCrudService<StaffRole> implements StaffRoleService {

    private final StaffRoleRepository staffRoleRepository;

    public StaffRoleServiceImpl(StaffRoleRepository repository) {
        super(repository);
        this.staffRoleRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "StaffRole";
    }

    @Override
    @Transactional(readOnly = true)
    public List<StaffRole> findByFilters(String name, Boolean active) {
        return staffRoleRepository.findByFilters(name, active);
    }
}


