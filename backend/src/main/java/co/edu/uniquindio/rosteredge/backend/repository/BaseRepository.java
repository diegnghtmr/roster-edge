package co.edu.uniquindio.rosteredge.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;

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
}
