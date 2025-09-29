package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.RosterDocumentTemplate;
import co.edu.uniquindio.rosteredge.backend.repository.RosterDocumentTemplateRepository;
import co.edu.uniquindio.rosteredge.backend.service.RosterDocumentTemplateService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RosterDocumentTemplateServiceImpl extends SimpleCrudService<RosterDocumentTemplate> implements RosterDocumentTemplateService {

    private final RosterDocumentTemplateRepository rosterDocumentTemplateRepository;

    public RosterDocumentTemplateServiceImpl(RosterDocumentTemplateRepository repository) {
        super(repository);
        this.rosterDocumentTemplateRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "RosterDocumentTemplate";
    }

    @Override
    @Transactional(readOnly = true)
    public List<RosterDocumentTemplate> findByFilters(Long rosterId, Long documentTemplateId, Boolean active) {
        return rosterDocumentTemplateRepository.findByFilters(rosterId, documentTemplateId, active);
    }
}


