package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Payment;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends BaseRepository<Payment, Long> {

    @Query("SELECT * FROM \"Payment\" WHERE (:paymentMethodId IS NULL OR payment_method_id = :paymentMethodId) " +
           "AND (:currencyId IS NULL OR currency_id = :currencyId) " +
           "AND (:planId IS NULL OR plan_id = :planId) " +
           "AND (:active IS NULL OR active = :active) " +
           "AND (:paymentDateFrom IS NULL OR payment_date >= :paymentDateFrom) " +
           "AND (:paymentDateTo IS NULL OR payment_date <= :paymentDateTo) " +
           "AND (:amountFrom IS NULL OR amount >= :amountFrom) " +
           "AND (:amountTo IS NULL OR amount <= :amountTo)")
    List<Payment> findByFilters(@Param("paymentMethodId") Long paymentMethodId,
                                @Param("currencyId") Long currencyId,
                                @Param("planId") Long planId,
                                @Param("active") Boolean active,
                                @Param("paymentDateFrom") LocalDateTime paymentDateFrom,
                                @Param("paymentDateTo") LocalDateTime paymentDateTo,
                                @Param("amountFrom") BigDecimal amountFrom,
                                @Param("amountTo") BigDecimal amountTo);
}

