package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PaymentService extends CrudService<Payment> {

    List<Payment> findByFilters(Long paymentMethodId, Long currencyId, Long planId, Long rosterId, Boolean active,
                                LocalDateTime paymentDateFrom, LocalDateTime paymentDateTo,
                                BigDecimal amountFrom, BigDecimal amountTo);
}
