package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.TeamCategory;
import co.edu.uniquindio.rosteredge.backend.service.TeamCategoryService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/team-categories")
public class TeamCategoryController extends SimpleCrudController<TeamCategory> {

    public TeamCategoryController(TeamCategoryService service) {
        super(service);
    }
}

