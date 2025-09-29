package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.RosterDocumentTemplate;
import co.edu.uniquindio.rosteredge.backend.service.RosterDocumentTemplateService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/roster-document-templates")
@Slf4j
public class RosterDocumentTemplateController extends SimpleCrudController<RosterDocumentTemplate> {

    private final RosterDocumentTemplateService rosterDocumentTemplateService;

    public RosterDocumentTemplateController(RosterDocumentTemplateService service) {
        super(service);
        this.rosterDocumentTemplateService = service;
    }

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<RosterDocumentTemplate>>> findAll() {
        HttpServletRequest request = currentRequest();
        
        Long rosterId = parseLong(request.getParameter("rosterId"));
        Long documentTemplateId = parseLong(request.getParameter("documentTemplateId"));
        Boolean active = parseBoolean(request.getParameter("active"));

        log.info("Request to get roster document templates with filters - rosterId: {}, documentTemplateId: {}, active: {}",
                rosterId, documentTemplateId, active);

        List<RosterDocumentTemplate> templates = rosterDocumentTemplateService.findByFilters(rosterId, documentTemplateId, active);
        return ResponseEntity.ok(ApiResponse.success(templates));
    }
}

