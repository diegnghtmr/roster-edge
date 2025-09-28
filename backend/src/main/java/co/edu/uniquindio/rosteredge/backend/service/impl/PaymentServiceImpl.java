package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Payment;
import co.edu.uniquindio.rosteredge.backend.repository.PaymentRepository;
import co.edu.uniquindio.rosteredge.backend.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PaymentServiceImpl extends SimpleCrudService<Payment> implements PaymentService {

    public PaymentServiceImpl(PaymentRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "Payment";
    }
}


