package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Plan;
import co.edu.uniquindio.rosteredge.backend.repository.PlanRepository;
import co.edu.uniquindio.rosteredge.backend.service.PlanService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class PlanServiceImpl extends SimpleCrudService<Plan> implements PlanService {

    private final PlanRepository planRepository;

    public PlanServiceImpl(PlanRepository repository) {
        super(repository);
        this.planRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "Plan";
    }

    @Override
    @Transactional(readOnly = true)
    public List<Plan> findByFilters(String name, Boolean active, BigDecimal priceFrom, BigDecimal priceTo) {
        return planRepository.findByFilters(name, active, priceFrom, priceTo);
    }
}


