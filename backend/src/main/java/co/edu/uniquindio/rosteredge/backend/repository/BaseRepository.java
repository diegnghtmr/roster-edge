package co.edu.uniquindio.rosteredge.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;

/**
 * Base interface for repositories with common CRUD operations
 * Extends Spring Data's CrudRepository
 * 
 * @param <T> Entity type
 * @param <ID> Entity ID type
 */
@NoRepositoryBean
public interface BaseRepository<T, ID> extends CrudRepository<T, ID> {
    
    /**
     * Find all records as a list
     * 
     * @return List of all entities
     */
    List<T> findAll();
    
    /**
     * Find active records (not deleted)
     * Note: This method should be implemented in each specific repository
     * according to the entity structure
     * 
     * @return List of active entities
     */
    // List<T> findByActiveTrue();
}
