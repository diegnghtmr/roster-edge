package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.Color;
import co.edu.uniquindio.rosteredge.backend.service.ColorService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/colors")
public class ColorController extends SimpleCrudController<Color> {

    public ColorController(ColorService service) {
        super(service);
    }
}

