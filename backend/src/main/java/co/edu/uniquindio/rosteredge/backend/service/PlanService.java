package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Plan;

import java.math.BigDecimal;
import java.util.List;

public interface PlanService extends CrudService<Plan> {

    List<Plan> findByFilters(String name, Boolean active, BigDecimal priceFrom, BigDecimal priceTo);
}
