package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.DocumentTemplate;
import co.edu.uniquindio.rosteredge.backend.service.DocumentTemplateService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/document-templates")
public class DocumentTemplateController extends SimpleCrudController<DocumentTemplate> {

    public DocumentTemplateController(DocumentTemplateService service) {
        super(service);
    }
}

