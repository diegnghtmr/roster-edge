package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.dto.filter.SubscriptionCoverageFilter;
import co.edu.uniquindio.rosteredge.backend.dto.response.SubscriptionCoverageResponse;
import co.edu.uniquindio.rosteredge.backend.model.Subscription;
import co.edu.uniquindio.rosteredge.backend.repository.SubscriptionRepository;
import co.edu.uniquindio.rosteredge.backend.repository.view.SubscriptionCoverageQueryRepository;
import co.edu.uniquindio.rosteredge.backend.service.SubscriptionService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SubscriptionServiceImpl extends SimpleCrudService<Subscription> implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionCoverageQueryRepository subscriptionCoverageQueryRepository;

    public SubscriptionServiceImpl(SubscriptionRepository repository,
                                    SubscriptionCoverageQueryRepository subscriptionCoverageQueryRepository) {
        super(repository);
        this.subscriptionRepository = repository;
        this.subscriptionCoverageQueryRepository = subscriptionCoverageQueryRepository;
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

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionCoverageResponse> findSubscriptionCoverage(SubscriptionCoverageFilter filter) {
        SubscriptionCoverageFilter effectiveFilter = filter != null ? filter : new SubscriptionCoverageFilter();
        return subscriptionCoverageQueryRepository.findSubscriptions(effectiveFilter);
    }
}
