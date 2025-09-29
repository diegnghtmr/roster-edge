package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Stadium;
import co.edu.uniquindio.rosteredge.backend.repository.StadiumRepository;
import co.edu.uniquindio.rosteredge.backend.service.StadiumService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class StadiumServiceImpl extends SimpleCrudService<Stadium> implements StadiumService {

    private final StadiumRepository stadiumRepository;

    public StadiumServiceImpl(StadiumRepository repository) {
        super(repository);
        this.stadiumRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "Stadium";
    }

    @Override
    @Transactional(readOnly = true)
    public List<Stadium> findByFilters(Long venueId, String surface, Boolean active,
                                       Integer capacityFrom, Integer capacityTo,
                                       LocalDate foundationFrom, LocalDate foundationTo,
                                       BigDecimal areaFrom, BigDecimal areaTo) {
        return stadiumRepository.findByFilters(venueId, surface, active, capacityFrom, capacityTo,
                foundationFrom, foundationTo, areaFrom, areaTo);
    }
}


