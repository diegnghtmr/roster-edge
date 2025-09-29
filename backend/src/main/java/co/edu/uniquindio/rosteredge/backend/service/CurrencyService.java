package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Currency;

import java.util.List;

public interface CurrencyService extends CrudService<Currency> {

    List<Currency> findByFilters(String name, String symbol, Boolean active);
}
