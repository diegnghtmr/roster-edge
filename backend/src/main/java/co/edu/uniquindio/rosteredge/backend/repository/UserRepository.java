package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.User;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for User entity
 * Provides data access methods for users
 */
@Repository
public interface UserRepository extends BaseRepository<User, Long> {

    /**
     * Find a user by email
     */
    Optional<User> findByEmail(@Param("email") String email);

    /**
     * Find all active users
     */
    @Query("SELECT * FROM \"User\" WHERE active = true")
    List<User> findByActiveTrue();

    /**
     * Check if a user exists with the given email
     */
    boolean existsByEmail(@Param("email") String email);
}
