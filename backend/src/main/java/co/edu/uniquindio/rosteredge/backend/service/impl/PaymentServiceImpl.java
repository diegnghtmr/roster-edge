package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Payment;
import co.edu.uniquindio.rosteredge.backend.repository.PaymentRepository;
import co.edu.uniquindio.rosteredge.backend.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class PaymentServiceImpl extends SimpleCrudService<Payment> implements PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository repository) {
        super(repository);
        this.paymentRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "Payment";
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payment> findByFilters(Long paymentMethodId, Long currencyId, Long planId, Boolean active,
                                       LocalDateTime paymentDateFrom, LocalDateTime paymentDateTo,
                                       BigDecimal amountFrom, BigDecimal amountTo) {
        return paymentRepository.findByFilters(paymentMethodId, currencyId, planId, active,
                paymentDateFrom, paymentDateTo, amountFrom, amountTo);
    }
}


