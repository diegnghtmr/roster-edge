package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Matchday;
import co.edu.uniquindio.rosteredge.backend.repository.MatchdayRepository;
import co.edu.uniquindio.rosteredge.backend.service.MatchdayService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MatchdayServiceImpl extends SimpleCrudService<Matchday> implements MatchdayService {

    public MatchdayServiceImpl(MatchdayRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "Matchday";
    }
}


