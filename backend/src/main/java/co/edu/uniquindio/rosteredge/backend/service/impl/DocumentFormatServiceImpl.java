package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.DocumentFormat;
import co.edu.uniquindio.rosteredge.backend.repository.DocumentFormatRepository;
import co.edu.uniquindio.rosteredge.backend.service.DocumentFormatService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DocumentFormatServiceImpl extends SimpleCrudService<DocumentFormat> implements DocumentFormatService {

    private final DocumentFormatRepository documentFormatRepository;

    public DocumentFormatServiceImpl(DocumentFormatRepository repository) {
        super(repository);
        this.documentFormatRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "DocumentFormat";
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentFormat> findByFilters(String name, Boolean active) {
        return documentFormatRepository.findByFilters(name, active);
    }
}


