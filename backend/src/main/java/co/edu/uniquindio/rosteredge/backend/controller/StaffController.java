package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.Staff;
import co.edu.uniquindio.rosteredge.backend.service.StaffService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/staff")
@Slf4j
public class StaffController extends SimpleCrudController<Staff> {

    private final StaffService staffService;

    public StaffController(StaffService service) {
        super(service);
        this.staffService = service;
    }

    @Override
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<Staff>>> findAll() {
        HttpServletRequest request = currentRequest();
        Long teamId = parseLong(request.getParameter("teamId"));
        Long staffRoleId = parseLong(request.getParameter("staffRoleId"));
        Boolean active = resolveActive(parseBoolean(request.getParameter("active")));
        String name = trimToNull(request.getParameter("name"));
        String lastName = trimToNull(request.getParameter("lastName"));
        String email = trimToNull(request.getParameter("email"));

        log.info("Request to get staff with filters - teamId: {}, staffRoleId: {}, active: {}, name: {}, lastName: {}, email: {}",
                teamId, staffRoleId, active, name, lastName, email);

        List<Staff> staff = staffService.findByFilters(teamId, staffRoleId, active, name, lastName, email);
        return ResponseEntity.ok(ApiResponse.success(staff));
    }

}
