package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.PlanBenefit;
import co.edu.uniquindio.rosteredge.backend.repository.PlanBenefitRepository;
import co.edu.uniquindio.rosteredge.backend.service.PlanBenefitService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PlanBenefitServiceImpl extends SimpleCrudService<PlanBenefit> implements PlanBenefitService {

    private final PlanBenefitRepository planBenefitRepository;

    public PlanBenefitServiceImpl(PlanBenefitRepository repository) {
        super(repository);
        this.planBenefitRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "PlanBenefit";
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlanBenefit> findByFilters(Long planId, String description, Boolean active) {
        return planBenefitRepository.findByFilters(planId, description, active);
    }
}


