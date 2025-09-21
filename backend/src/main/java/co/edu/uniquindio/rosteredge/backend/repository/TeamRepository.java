package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Team;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Team entity
 */
@Repository
public interface TeamRepository extends BaseRepository<Team, Long> {

    @Query("SELECT * FROM \"Team\" WHERE name = :name")
    Optional<Team> findByName(@Param("name") String name);

    @Query("SELECT * FROM \"Team\" WHERE active = true")
    List<Team> findByActiveTrue();

    @Override
    @Query("SELECT * FROM \"Team\"")
    List<Team> findAll();

    @Query("SELECT COUNT(*) > 0 FROM \"Team\" WHERE name = :name")
    boolean existsByName(@Param("name") String name);

}
