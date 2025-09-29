package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.PaymentMethod;

import java.util.List;

public interface PaymentMethodService extends CrudService<PaymentMethod> {

    List<PaymentMethod> findByFilters(String name, Boolean active);
}

