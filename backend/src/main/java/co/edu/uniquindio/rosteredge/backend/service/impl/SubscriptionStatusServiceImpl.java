package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.SubscriptionStatus;
import co.edu.uniquindio.rosteredge.backend.repository.SubscriptionStatusRepository;
import co.edu.uniquindio.rosteredge.backend.service.SubscriptionStatusService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SubscriptionStatusServiceImpl extends SimpleCrudService<SubscriptionStatus> implements SubscriptionStatusService {

    public SubscriptionStatusServiceImpl(SubscriptionStatusRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "SubscriptionStatus";
    }
}


