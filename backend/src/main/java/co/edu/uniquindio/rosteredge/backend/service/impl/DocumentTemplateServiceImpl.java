package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.DocumentTemplate;
import co.edu.uniquindio.rosteredge.backend.repository.DocumentTemplateRepository;
import co.edu.uniquindio.rosteredge.backend.service.DocumentTemplateService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DocumentTemplateServiceImpl extends SimpleCrudService<DocumentTemplate> implements DocumentTemplateService {

    public DocumentTemplateServiceImpl(DocumentTemplateRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "DocumentTemplate";
    }
}


