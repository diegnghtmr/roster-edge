package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Roster;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

public interface RosterService extends CrudService<Roster> {
    Optional<Roster> findByEmail(String email);

    String authenticate(String email, String password);

    Optional<Roster> resolveRoster(String token);

    void logout(String token);

    List<Roster> findByFilters(Long clubId, Long subscriptionId, Boolean active,
                               String name, String email,
                               LocalDate creationFrom, LocalDate creationTo,
                               LocalDate lastAccessFrom, LocalDate lastAccessTo);
}





