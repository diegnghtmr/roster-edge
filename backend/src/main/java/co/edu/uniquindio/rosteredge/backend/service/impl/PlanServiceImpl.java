package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Plan;
import co.edu.uniquindio.rosteredge.backend.repository.PlanRepository;
import co.edu.uniquindio.rosteredge.backend.service.PlanService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PlanServiceImpl extends SimpleCrudService<Plan> implements PlanService {

    public PlanServiceImpl(PlanRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "Plan";
    }
}


