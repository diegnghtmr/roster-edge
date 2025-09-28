package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Staff;
import co.edu.uniquindio.rosteredge.backend.repository.StaffRepository;
import co.edu.uniquindio.rosteredge.backend.service.StaffService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class StaffServiceImpl extends SimpleCrudService<Staff> implements StaffService {

    public StaffServiceImpl(StaffRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "Staff";
    }
}


