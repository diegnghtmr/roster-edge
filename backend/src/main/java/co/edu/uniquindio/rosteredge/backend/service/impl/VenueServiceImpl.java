package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Venue;
import co.edu.uniquindio.rosteredge.backend.repository.VenueRepository;
import co.edu.uniquindio.rosteredge.backend.service.VenueService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class VenueServiceImpl extends SimpleCrudService<Venue> implements VenueService {

    public VenueServiceImpl(VenueRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "Venue";
    }
}


