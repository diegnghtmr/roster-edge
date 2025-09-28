package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Country;
import co.edu.uniquindio.rosteredge.backend.repository.CountryRepository;
import co.edu.uniquindio.rosteredge.backend.service.CountryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CountryServiceImpl extends SimpleCrudService<Country> implements CountryService {

    public CountryServiceImpl(CountryRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "Country";
    }
}


