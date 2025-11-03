package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Staff;
import co.edu.uniquindio.rosteredge.backend.repository.StaffRepository;
import co.edu.uniquindio.rosteredge.backend.service.StaffService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
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
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        return staffRepository.findByFilters(teamId, staffRoleId, effectiveActive);
    }
}


