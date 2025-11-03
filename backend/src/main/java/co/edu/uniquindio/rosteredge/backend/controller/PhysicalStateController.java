package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.PhysicalState;
import co.edu.uniquindio.rosteredge.backend.service.PhysicalStateService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/physical-states")
@Slf4j
public class PhysicalStateController extends SimpleCrudController<PhysicalState> {

    private final PhysicalStateService physicalStateService;

    public PhysicalStateController(PhysicalStateService service) {
        super(service);
        this.physicalStateService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<PhysicalState>>> findAll() {
        HttpServletRequest request = currentRequest();
        
        String name = trimToNull(request.getParameter("name"));
        Boolean active = resolveActive(parseBoolean(request.getParameter("active")));

        log.info("Request to get physical states with filters - name: {}, active: {}", name, active);

        List<PhysicalState> states = physicalStateService.findByFilters(name, active);
        return ResponseEntity.ok(ApiResponse.success(states));
    }
}

