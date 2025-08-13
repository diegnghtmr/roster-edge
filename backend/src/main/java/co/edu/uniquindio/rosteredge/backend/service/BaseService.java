package co.edu.uniquindio.rosteredge.backend.service;

import java.util.List;
import java.util.Optional;

/**
 * Base interface for services with generic CRUD operations
 * Defines common methods that all services must implement
 * 
 * @param <T> Entity type
 * @param <ID> Entity ID type
 */
public interface BaseService<T, ID> {
    
    /**
     * Save an entity (create or update)
     * 
     * @param entity The entity to save
     * @return The saved entity
     */
    T save(T entity);
    
    /**
     * Find an entity by its ID
     * 
     * @param id The entity ID
     * @return Optional containing the found entity
     */
    Optional<T> findById(ID id);
    
    /**
     * Get all entities
     * 
     * @return List of all entities
     */
    List<T> findAll();
    
    /**
     * Update an existing entity
     * 
     * @param id The ID of the entity to update
     * @param entity The entity with new data
     * @return The updated entity
     */
    T update(ID id, T entity);
    
    /**
     * Delete an entity by its ID
     * 
     * @param id The ID of the entity to delete
     */
    void deleteById(ID id);
    
    /**
     * Check if an entity exists with the given ID
     * 
     * @param id The ID to check
     * @return true if exists, false otherwise
     */
    boolean existsById(ID id);
    
    /**
     * Count the total number of entities
     * 
     * @return The total number of entities
     */
    long count();
    
    /**
     * Find an entity by ID or throw exception if not found
     * 
     * @param id The entity ID
     * @return The found entity
     * @throws EntityNotFoundException if entity is not found
     */
    T findByIdOrThrow(ID id);
}
