package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.Color;
import co.edu.uniquindio.rosteredge.backend.service.ColorService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/colors")
@Slf4j
public class ColorController extends SimpleCrudController<Color> {

    private final ColorService colorService;

    public ColorController(ColorService service) {
        super(service);
        this.colorService = service;
    }

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<Color>>> findAll() {
        HttpServletRequest request = currentRequest();
        String name = trimToNull(request.getParameter("name"));
        Boolean active = parseBoolean(request.getParameter("active"));

        log.info("Request to get colors with filters - name: {}, active: {}", name, active);

        List<Color> colors = colorService.findByFilters(name, active);
        return ResponseEntity.ok(ApiResponse.success(colors));
    }
}

