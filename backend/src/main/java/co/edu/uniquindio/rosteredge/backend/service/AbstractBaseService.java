package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.repository.BaseRepository;
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
        return repository.save(entity);
    }
    
    @Override
    public Optional<T> findById(ID id) {
        return repository.findById(id);
    }
    
    @Override
    public List<T> findAll() {
        return repository.findAll();
    }
    
    @Override
    public abstract T update(ID id, T entity);
    
    @Override
    public void deleteById(ID id) {
        if (!existsById(id)) {
            throw new RuntimeException("Entity not found with id: " + id);
        }
        repository.deleteById(id);
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
     * @throws RuntimeException if entity is not found
     */
    protected T findByIdOrThrow(ID id) {
        return findById(id)
                .orElseThrow(() -> new RuntimeException("Entity not found with id: " + id));
    }
}
