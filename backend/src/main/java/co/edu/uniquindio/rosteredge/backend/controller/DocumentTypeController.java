package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.DocumentType;
import co.edu.uniquindio.rosteredge.backend.service.DocumentTypeService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/document-types")
@Slf4j
public class DocumentTypeController extends SimpleCrudController<DocumentType> {

    private final DocumentTypeService documentTypeService;

    public DocumentTypeController(DocumentTypeService service) {
        super(service);
        this.documentTypeService = service;
    }

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentType>>> findAll() {
        HttpServletRequest request = currentRequest();
        String name = trimToNull(request.getParameter("name"));
        Boolean active = parseBoolean(request.getParameter("active"));

        log.info("Request to get document types with filters - name: {}, active: {}", name, active);

        List<DocumentType> types = documentTypeService.findByFilters(name, active);
        return ResponseEntity.ok(ApiResponse.success(types));
    }
}

