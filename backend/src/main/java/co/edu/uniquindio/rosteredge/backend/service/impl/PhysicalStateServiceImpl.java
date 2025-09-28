package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.PhysicalState;
import co.edu.uniquindio.rosteredge.backend.repository.PhysicalStateRepository;
import co.edu.uniquindio.rosteredge.backend.service.PhysicalStateService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PhysicalStateServiceImpl extends SimpleCrudService<PhysicalState> implements PhysicalStateService {

    public PhysicalStateServiceImpl(PhysicalStateRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "PhysicalState";
    }
}


