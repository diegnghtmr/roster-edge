package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.City;
import co.edu.uniquindio.rosteredge.backend.service.CityService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cities")
public class CityController extends SimpleCrudController<City> {

    public CityController(CityService service) {
        super(service);
    }
}

