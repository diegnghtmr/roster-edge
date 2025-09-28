package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Roster;
import org.springframework.stereotype.Repository;

@Repository
public interface RosterRepository extends BaseRepository<Roster, Long> {
}

