package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Currency;
import co.edu.uniquindio.rosteredge.backend.repository.CurrencyRepository;
import co.edu.uniquindio.rosteredge.backend.service.CurrencyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CurrencyServiceImpl extends SimpleCrudService<Currency> implements CurrencyService {

    private final CurrencyRepository currencyRepository;

    public CurrencyServiceImpl(CurrencyRepository repository) {
        super(repository);
        this.currencyRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "Currency";
    }

    @Override
    @Transactional(readOnly = true)
    public List<Currency> findByFilters(String name, String symbol, Boolean active) {
        return currencyRepository.findByFilters(name, symbol, active);
    }
}


