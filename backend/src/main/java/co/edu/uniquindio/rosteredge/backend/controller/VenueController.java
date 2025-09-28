package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.Venue;
import co.edu.uniquindio.rosteredge.backend.service.VenueService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/venues")
public class VenueController extends SimpleCrudController<Venue> {

    public VenueController(VenueService service) {
        super(service);
    }
}

