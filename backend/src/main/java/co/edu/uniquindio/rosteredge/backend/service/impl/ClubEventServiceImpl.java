package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.ClubEvent;
import co.edu.uniquindio.rosteredge.backend.repository.ClubEventRepository;
import co.edu.uniquindio.rosteredge.backend.service.ClubEventService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ClubEventServiceImpl extends SimpleCrudService<ClubEvent> implements ClubEventService {

    private final ClubEventRepository clubEventRepository;

    public ClubEventServiceImpl(ClubEventRepository repository) {
        super(repository);
        this.clubEventRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "ClubEvent";
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClubEvent> findByFilters(Long clubId, Long eventId, Boolean active) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        return clubEventRepository.findByFilters(clubId, eventId, effectiveActive);
    }
}


