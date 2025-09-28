package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.DocumentFormat;
import co.edu.uniquindio.rosteredge.backend.service.DocumentFormatService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/document-formats")
public class DocumentFormatController extends SimpleCrudController<DocumentFormat> {

    public DocumentFormatController(DocumentFormatService service) {
        super(service);
    }
}

