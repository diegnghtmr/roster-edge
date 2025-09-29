package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Venue;
import co.edu.uniquindio.rosteredge.backend.repository.VenueRepository;
import co.edu.uniquindio.rosteredge.backend.service.VenueService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class VenueServiceImpl extends SimpleCrudService<Venue> implements VenueService {

    private final VenueRepository venueRepository;

    public VenueServiceImpl(VenueRepository repository) {
        super(repository);
        this.venueRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "Venue";
    }

    @Override
    @Transactional(readOnly = true)
    public List<Venue> findByFilters(Long clubId, Long cityId, Boolean active,
                                     String name, String email,
                                     LocalDate foundationFrom, LocalDate foundationTo) {
        return venueRepository.findByFilters(clubId, cityId, active, name, email, foundationFrom, foundationTo);
    }
}


