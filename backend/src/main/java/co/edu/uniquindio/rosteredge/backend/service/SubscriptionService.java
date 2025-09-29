package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Subscription;

import java.time.LocalDate;
import java.util.List;

public interface SubscriptionService extends CrudService<Subscription> {

    List<Subscription> findByFilters(Long planId, Long statusId, Boolean active,
                                     LocalDate startDateFrom, LocalDate startDateTo,
                                     LocalDate endDateFrom, LocalDate endDateTo);
}
