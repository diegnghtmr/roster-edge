package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.RosterDocumentTemplate;
import co.edu.uniquindio.rosteredge.backend.repository.RosterDocumentTemplateRepository;
import co.edu.uniquindio.rosteredge.backend.service.RosterDocumentTemplateService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RosterDocumentTemplateServiceImpl extends SimpleCrudService<RosterDocumentTemplate> implements RosterDocumentTemplateService {

    public RosterDocumentTemplateServiceImpl(RosterDocumentTemplateRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "RosterDocumentTemplate";
    }
}


