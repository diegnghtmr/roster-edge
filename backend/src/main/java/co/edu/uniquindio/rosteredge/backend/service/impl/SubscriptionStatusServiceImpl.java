package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.SubscriptionStatus;
import co.edu.uniquindio.rosteredge.backend.repository.SubscriptionStatusRepository;
import co.edu.uniquindio.rosteredge.backend.service.SubscriptionStatusService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SubscriptionStatusServiceImpl extends SimpleCrudService<SubscriptionStatus> implements SubscriptionStatusService {

    private final SubscriptionStatusRepository subscriptionStatusRepository;

    public SubscriptionStatusServiceImpl(SubscriptionStatusRepository repository) {
        super(repository);
        this.subscriptionStatusRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "SubscriptionStatus";
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionStatus> findByFilters(String name, Boolean active) {
        return subscriptionStatusRepository.findByFilters(name, active);
    }
}


