package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.TeamGender;

import java.util.List;

public interface TeamGenderService extends CrudService<TeamGender> {

    List<TeamGender> findByFilters(String name, Boolean active);
}

