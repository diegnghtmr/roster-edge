package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Subscription;
import co.edu.uniquindio.rosteredge.backend.repository.SubscriptionRepository;
import co.edu.uniquindio.rosteredge.backend.service.SubscriptionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class SubscriptionServiceImpl extends SimpleCrudService<Subscription> implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    public SubscriptionServiceImpl(SubscriptionRepository repository) {
        super(repository);
        this.subscriptionRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "Subscription";
    }

    @Override
    @Transactional(readOnly = true)
    public List<Subscription> findByFilters(Long planId, Long statusId, Boolean active,
                                            LocalDate startDateFrom, LocalDate startDateTo,
                                            LocalDate endDateFrom, LocalDate endDateTo) {
        return subscriptionRepository.findByFilters(planId, statusId, active, startDateFrom, startDateTo,
                endDateFrom, endDateTo);
    }
}


