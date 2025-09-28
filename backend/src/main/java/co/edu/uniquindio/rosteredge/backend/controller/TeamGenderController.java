package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.TeamGender;
import co.edu.uniquindio.rosteredge.backend.service.TeamGenderService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/team-genders")
public class TeamGenderController extends SimpleCrudController<TeamGender> {

    public TeamGenderController(TeamGenderService service) {
        super(service);
    }
}

