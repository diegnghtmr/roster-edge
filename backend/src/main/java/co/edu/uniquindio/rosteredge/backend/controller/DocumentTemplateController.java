package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.DocumentTemplate;
import co.edu.uniquindio.rosteredge.backend.service.DocumentTemplateService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/document-templates")
@Slf4j
public class DocumentTemplateController extends SimpleCrudController<DocumentTemplate> {

    private final DocumentTemplateService documentTemplateService;

    public DocumentTemplateController(DocumentTemplateService service) {
        super(service);
        this.documentTemplateService = service;
    }

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentTemplate>>> findAll() {
        HttpServletRequest request = currentRequest();
        String name = trimToNull(request.getParameter("name"));
        Long documentFormatId = parseLong(request.getParameter("documentFormatId"));
        Long documentTypeId = parseLong(request.getParameter("documentTypeId"));
        Boolean active = parseBoolean(request.getParameter("active"));
        LocalDateTime createdFrom = parseDateTime(request.getParameter("creationFrom"));
        LocalDateTime createdTo = parseDateTime(request.getParameter("creationTo"));

        log.info("Request to get document templates with filters - name: {}, documentFormatId: {}, documentTypeId: {}, active: {}, creationFrom: {}, creationTo: {}",
                name, documentFormatId, documentTypeId, active, createdFrom, createdTo);

        List<DocumentTemplate> templates = documentTemplateService.findByFilters(name, documentFormatId, documentTypeId,
                active, createdFrom, createdTo);
        return ResponseEntity.ok(ApiResponse.success(templates));
    }
}

