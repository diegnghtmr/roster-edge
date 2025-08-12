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
     * Find a user by username
     */
    @Query("SELECT * FROM users WHERE username = :username")
    Optional<User> findByUsername(@Param("username") String username);
    
    /**
     * Find a user by email
     */
    @Query("SELECT * FROM users WHERE email = :email")
    Optional<User> findByEmail(@Param("email") String email);
    
    /**
     * Find a user by auth token
     */
    @Query("SELECT * FROM users WHERE auth_token = :token")
    Optional<User> findByAuthToken(@Param("token") String token);
    
    /**
     * Find all active users
     */
    @Query("SELECT * FROM users WHERE active = true")
    List<User> findByActiveTrue();
    
    /**
     * Find users by role
     */
    @Query("SELECT * FROM users WHERE role = :role")
    List<User> findByRole(@Param("role") String role);
    
    /**
     * Find users by status
     */
    @Query("SELECT * FROM users WHERE status = :status")
    List<User> findByStatus(@Param("status") String status);
    
    /**
     * Check if a user exists with the given username
     */
    @Query("SELECT COUNT(*) > 0 FROM users WHERE username = :username")
    boolean existsByUsername(@Param("username") String username);
    
    /**
     * Check if a user exists with the given email
     */
    @Query("SELECT COUNT(*) > 0 FROM users WHERE email = :email")
    boolean existsByEmail(@Param("email") String email);
}
