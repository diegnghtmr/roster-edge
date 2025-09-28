package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Subscription;
import co.edu.uniquindio.rosteredge.backend.repository.SubscriptionRepository;
import co.edu.uniquindio.rosteredge.backend.service.SubscriptionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SubscriptionServiceImpl extends SimpleCrudService<Subscription> implements SubscriptionService {

    public SubscriptionServiceImpl(SubscriptionRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "Subscription";
    }
}


