package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Matchday;

import java.util.List;

public interface MatchdayService extends CrudService<Matchday> {

    List<Matchday> findByFilters(String name, Boolean active);
}
