package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.City;
import co.edu.uniquindio.rosteredge.backend.repository.CityRepository;
import co.edu.uniquindio.rosteredge.backend.service.CityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CityServiceImpl extends SimpleCrudService<City> implements CityService {

    public CityServiceImpl(CityRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "City";
    }
}


