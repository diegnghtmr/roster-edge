package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Roster;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RosterRepository extends BaseRepository<Roster, Long> {
    Optional<Roster> findByEmail(String email);
}




