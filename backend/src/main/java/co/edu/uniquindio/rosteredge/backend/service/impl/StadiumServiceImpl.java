package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Stadium;
import co.edu.uniquindio.rosteredge.backend.repository.StadiumRepository;
import co.edu.uniquindio.rosteredge.backend.service.StadiumService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class StadiumServiceImpl extends SimpleCrudService<Stadium> implements StadiumService {

    public StadiumServiceImpl(StadiumRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "Stadium";
    }
}


