package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.User;
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
     * 
     * @param username The username
     * @return Optional containing the found user
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Find a user by email
     * 
     * @param email The email address
     * @return Optional containing the found user
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Find all active users
     * 
     * @return List of active users
     */
    List<User> findByActiveTrue();
    
    /**
     * Find users by role
     * 
     * @param role The role to search for
     * @return List of users with that role
     */
    List<User> findByRole(String role);
    
    /**
     * Find users by status
     * 
     * @param status The status to search for
     * @return List of users with that status
     */
    List<User> findByStatus(String status);
    
    /**
     * Check if a user exists with the given username
     * 
     * @param username The username
     * @return true if exists, false otherwise
     */
    boolean existsByUsername(String username);
    
    /**
     * Check if a user exists with the given email
     * 
     * @param email The email address
     * @return true if exists, false otherwise
     */
    boolean existsByEmail(String email);
}
