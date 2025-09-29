package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.PhysicalState;
import co.edu.uniquindio.rosteredge.backend.repository.PhysicalStateRepository;
import co.edu.uniquindio.rosteredge.backend.service.PhysicalStateService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PhysicalStateServiceImpl extends SimpleCrudService<PhysicalState> implements PhysicalStateService {

    private final PhysicalStateRepository physicalStateRepository;

    public PhysicalStateServiceImpl(PhysicalStateRepository repository) {
        super(repository);
        this.physicalStateRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "PhysicalState";
    }

    @Override
    @Transactional(readOnly = true)
    public List<PhysicalState> findByFilters(String name, Boolean active) {
        return physicalStateRepository.findByFilters(name, active);
    }
}


