package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.Roster;

import java.util.Optional;

public interface RosterService extends CrudService<Roster> {
    Optional<Roster> findByEmail(String email);

    String authenticate(String email, String password);

    Optional<Roster> resolveRoster(String token);

    void logout(String token);
}





