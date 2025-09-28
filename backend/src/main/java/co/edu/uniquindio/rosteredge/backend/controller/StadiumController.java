package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.Stadium;
import co.edu.uniquindio.rosteredge.backend.service.StadiumService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stadiums")
public class StadiumController extends SimpleCrudController<Stadium> {

    public StadiumController(StadiumService service) {
        super(service);
    }
}

