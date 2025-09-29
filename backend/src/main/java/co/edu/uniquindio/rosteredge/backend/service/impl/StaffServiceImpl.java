package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Staff;
import co.edu.uniquindio.rosteredge.backend.repository.StaffRepository;
import co.edu.uniquindio.rosteredge.backend.service.StaffService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StaffServiceImpl extends SimpleCrudService<Staff> implements StaffService {

    private final StaffRepository staffRepository;

    public StaffServiceImpl(StaffRepository repository) {
        super(repository);
        this.staffRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "Staff";
    }

    @Override
    @Transactional(readOnly = true)
    public List<Staff> findByFilters(Long teamId, Long staffRoleId, Boolean active) {
        return staffRepository.findByFilters(teamId, staffRoleId, active);
    }
}


