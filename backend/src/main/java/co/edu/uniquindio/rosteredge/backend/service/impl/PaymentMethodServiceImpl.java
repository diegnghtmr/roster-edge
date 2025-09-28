package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.PaymentMethod;
import co.edu.uniquindio.rosteredge.backend.repository.PaymentMethodRepository;
import co.edu.uniquindio.rosteredge.backend.service.PaymentMethodService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PaymentMethodServiceImpl extends SimpleCrudService<PaymentMethod> implements PaymentMethodService {

    public PaymentMethodServiceImpl(PaymentMethodRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "PaymentMethod";
    }
}


