package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.PaymentMethod;
import co.edu.uniquindio.rosteredge.backend.repository.PaymentMethodRepository;
import co.edu.uniquindio.rosteredge.backend.service.PaymentMethodService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PaymentMethodServiceImpl extends SimpleCrudService<PaymentMethod> implements PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;

    public PaymentMethodServiceImpl(PaymentMethodRepository repository) {
        super(repository);
        this.paymentMethodRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "PaymentMethod";
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentMethod> findByFilters(String name, Boolean active) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        return paymentMethodRepository.findByFilters(name, effectiveActive);
    }
}


