package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.PlanBenefit;
import co.edu.uniquindio.rosteredge.backend.repository.PlanBenefitRepository;
import co.edu.uniquindio.rosteredge.backend.service.PlanBenefitService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PlanBenefitServiceImpl extends SimpleCrudService<PlanBenefit> implements PlanBenefitService {

    public PlanBenefitServiceImpl(PlanBenefitRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "PlanBenefit";
    }
}


