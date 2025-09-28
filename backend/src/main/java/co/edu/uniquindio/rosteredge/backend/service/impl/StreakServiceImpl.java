package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Streak;
import co.edu.uniquindio.rosteredge.backend.repository.StreakRepository;
import co.edu.uniquindio.rosteredge.backend.service.StreakService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class StreakServiceImpl extends SimpleCrudService<Streak> implements StreakService {

    public StreakServiceImpl(StreakRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "Streak";
    }
}


