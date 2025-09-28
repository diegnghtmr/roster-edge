package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Currency;
import co.edu.uniquindio.rosteredge.backend.repository.CurrencyRepository;
import co.edu.uniquindio.rosteredge.backend.service.CurrencyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CurrencyServiceImpl extends SimpleCrudService<Currency> implements CurrencyService {

    public CurrencyServiceImpl(CurrencyRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "Currency";
    }
}


