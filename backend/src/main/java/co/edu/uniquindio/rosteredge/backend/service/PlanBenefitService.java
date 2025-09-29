package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.PlanBenefit;

import java.util.List;

public interface PlanBenefitService extends CrudService<PlanBenefit> {

    List<PlanBenefit> findByFilters(Long planId, String description, Boolean active);
}

