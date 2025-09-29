package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.City;
import co.edu.uniquindio.rosteredge.backend.repository.CityRepository;
import co.edu.uniquindio.rosteredge.backend.service.CityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CityServiceImpl extends SimpleCrudService<City> implements CityService {

    private final CityRepository cityRepository;

    public CityServiceImpl(CityRepository repository) {
        super(repository);
        this.cityRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "City";
    }

    @Override
    @Transactional(readOnly = true)
    public List<City> findByFilters(Long countryId, String name, Boolean active) {
        return cityRepository.findByFilters(countryId, name, active);
    }
}


