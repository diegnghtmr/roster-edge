package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.exception.EntityNotFoundException;
import co.edu.uniquindio.rosteredge.backend.repository.BaseRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Abstract implementation of base service
 * Provides default implementation of CRUD operations
 * 
 * @param <T> Entity type
 * @param <ID> Entity ID type
 */
@Transactional
@Slf4j
public abstract class AbstractBaseService<T, ID> implements BaseService<T, ID> {
    
    protected final BaseRepository<T, ID> repository;
    
    /**
     * Constructor that receives the repository
     * 
     * @param repository The repository to use
     */
    protected AbstractBaseService(BaseRepository<T, ID> repository) {
        this.repository = repository;
    }
    
    @Override
    public T save(T entity) {
        log.debug("Saving entity: {}", entity);
        T saved = repository.save(entity);
        log.debug("Entity saved successfully: {}", saved);
        return saved;
    }
    
    @Override
    public Optional<T> findById(ID id) {
        log.debug("Finding entity by id: {}", id);
        return repository.findById(id);
    }
    
    @Override
    public List<T> findAll() {
        log.debug("Finding all entities");
        return repository.findAll();
    }
    
    @Override
    public T update(ID id, T entity) {
        log.debug("Updating entity with id: {}", id);
        if (!existsById(id)) {
            throw new EntityNotFoundException(getEntityName(), id.toString());
        }
        // This is a default implementation
        // Subclasses should override this method for proper update logic
        return repository.save(entity);
    }
    
    @Override
    public void deleteById(ID id) {
        log.debug("Deleting entity with id: {}", id);
        if (!existsById(id)) {
            throw new EntityNotFoundException(getEntityName(), id.toString());
        }
        repository.deleteById(id);
        log.debug("Entity deleted successfully");
    }
    
    @Override
    public boolean existsById(ID id) {
        return repository.existsById(id);
    }
    
    @Override
    public long count() {
        return repository.count();
    }
    
    /**
     * Helper method to verify that an entity exists
     * 
     * @param id The entity ID
     * @return The found entity
     * @throws EntityNotFoundException if entity is not found
     */
    protected T findByIdOrThrow(ID id) {
        return findById(id)
                .orElseThrow(() -> new EntityNotFoundException(getEntityName(), id.toString()));
    }
    
    /**
     * Get the entity name for error messages
     * Subclasses should override this method
     * 
     * @return The entity name
     */
    protected abstract String getEntityName();
}
