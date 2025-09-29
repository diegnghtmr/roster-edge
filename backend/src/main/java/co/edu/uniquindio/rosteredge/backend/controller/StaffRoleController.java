package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.StaffRole;
import co.edu.uniquindio.rosteredge.backend.service.StaffRoleService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/staff-roles")
@Slf4j
public class StaffRoleController extends SimpleCrudController<StaffRole> {

    private final StaffRoleService staffRoleService;

    public StaffRoleController(StaffRoleService service) {
        super(service);
        this.staffRoleService = service;
    }

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<StaffRole>>> findAll() {
        HttpServletRequest request = currentRequest();
        String name = request.getParameter("name");
        Boolean active = parseBoolean(request.getParameter("active"));

        log.info("Request to get staff roles with filters - name: {}, active: {}", name, active);

        List<StaffRole> roles = staffRoleService.findByFilters(name, active);
        return ResponseEntity.ok(ApiResponse.success(roles));
    }

}
