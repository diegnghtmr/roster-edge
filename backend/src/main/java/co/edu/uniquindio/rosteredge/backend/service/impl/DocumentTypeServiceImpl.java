package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.DocumentType;
import co.edu.uniquindio.rosteredge.backend.repository.DocumentTypeRepository;
import co.edu.uniquindio.rosteredge.backend.service.DocumentTypeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DocumentTypeServiceImpl extends SimpleCrudService<DocumentType> implements DocumentTypeService {

    private final DocumentTypeRepository documentTypeRepository;

    public DocumentTypeServiceImpl(DocumentTypeRepository repository) {
        super(repository);
        this.documentTypeRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "DocumentType";
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentType> findByFilters(String name, Boolean active) {
        return documentTypeRepository.findByFilters(name, active);
    }
}


