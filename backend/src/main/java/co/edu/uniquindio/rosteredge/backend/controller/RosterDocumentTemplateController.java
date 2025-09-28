package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.RosterDocumentTemplate;
import co.edu.uniquindio.rosteredge.backend.service.RosterDocumentTemplateService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/roster-document-templates")
public class RosterDocumentTemplateController extends SimpleCrudController<RosterDocumentTemplate> {

    public RosterDocumentTemplateController(RosterDocumentTemplateService service) {
        super(service);
    }
}

