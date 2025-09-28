package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.DocumentType;
import co.edu.uniquindio.rosteredge.backend.repository.DocumentTypeRepository;
import co.edu.uniquindio.rosteredge.backend.service.DocumentTypeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DocumentTypeServiceImpl extends SimpleCrudService<DocumentType> implements DocumentTypeService {

    public DocumentTypeServiceImpl(DocumentTypeRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "DocumentType";
    }
}


