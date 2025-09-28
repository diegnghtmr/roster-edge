package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.DocumentType;
import co.edu.uniquindio.rosteredge.backend.service.DocumentTypeService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/document-types")
public class DocumentTypeController extends SimpleCrudController<DocumentType> {

    public DocumentTypeController(DocumentTypeService service) {
        super(service);
    }
}

