package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.DocumentFormat;
import co.edu.uniquindio.rosteredge.backend.service.DocumentFormatService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/document-formats")
@Slf4j
public class DocumentFormatController extends SimpleCrudController<DocumentFormat> {

    private final DocumentFormatService documentFormatService;

    public DocumentFormatController(DocumentFormatService service) {
        super(service);
        this.documentFormatService = service;
    }

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentFormat>>> findAll() {
        HttpServletRequest request = currentRequest();
        String name = trimToNull(request.getParameter("name"));
        Boolean active = parseBoolean(request.getParameter("active"));

        log.info("Request to get document formats with filters - name: {}, active: {}", name, active);

        List<DocumentFormat> formats = documentFormatService.findByFilters(name, active);
        return ResponseEntity.ok(ApiResponse.success(formats));
    }
}

