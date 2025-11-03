package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Country;
import co.edu.uniquindio.rosteredge.backend.repository.CountryRepository;
import co.edu.uniquindio.rosteredge.backend.service.CountryService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CountryServiceImpl extends SimpleCrudService<Country> implements CountryService {

    private final CountryRepository countryRepository;

    public CountryServiceImpl(CountryRepository repository) {
        super(repository);
        this.countryRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "Country";
    }

    @Override
    @Transactional(readOnly = true)
   public List<Country> findByFilters(String name, Boolean active) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        return countryRepository.findByFilters(name, effectiveActive);
    }
}


