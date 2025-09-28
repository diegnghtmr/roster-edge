package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.DocumentFormat;
import co.edu.uniquindio.rosteredge.backend.repository.DocumentFormatRepository;
import co.edu.uniquindio.rosteredge.backend.service.DocumentFormatService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DocumentFormatServiceImpl extends SimpleCrudService<DocumentFormat> implements DocumentFormatService {

    public DocumentFormatServiceImpl(DocumentFormatRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "DocumentFormat";
    }
}


