package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.Country;
import co.edu.uniquindio.rosteredge.backend.service.CountryService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/countries")
public class CountryController extends SimpleCrudController<Country> {

    public CountryController(CountryService service) {
        super(service);
    }
}

