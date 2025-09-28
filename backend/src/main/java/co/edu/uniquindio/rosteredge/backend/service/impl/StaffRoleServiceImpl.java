package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.StaffRole;
import co.edu.uniquindio.rosteredge.backend.repository.StaffRoleRepository;
import co.edu.uniquindio.rosteredge.backend.service.StaffRoleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class StaffRoleServiceImpl extends SimpleCrudService<StaffRole> implements StaffRoleService {

    public StaffRoleServiceImpl(StaffRoleRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "StaffRole";
    }
}


