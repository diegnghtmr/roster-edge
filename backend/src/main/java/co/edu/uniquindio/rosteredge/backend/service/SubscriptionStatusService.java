package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.SubscriptionStatus;

import java.util.List;

public interface SubscriptionStatusService extends CrudService<SubscriptionStatus> {

    List<SubscriptionStatus> findByFilters(String name, Boolean active);
}

