package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.BaseEntity;
import co.edu.uniquindio.rosteredge.backend.repository.BaseRepository;
import co.edu.uniquindio.rosteredge.backend.service.AbstractBaseService;
import co.edu.uniquindio.rosteredge.backend.service.CrudService;

/**
 * Generic CRUD service implementation that takes care of timestamp handling.
 */
public abstract class SimpleCrudService<T extends BaseEntity> extends AbstractBaseService<T, Long>
        implements CrudService<T> {

    protected SimpleCrudService(BaseRepository<T, Long> repository) {
        super(repository);
    }

    @Override
    public T save(T entity) {
        entity.prePersist();
        return super.save(entity);
    }

    @Override
    public T update(Long id, T entity) {
        T existing = findByIdOrThrow(id);
        entity.setId(id);
        entity.setCreatedAt(existing.getCreatedAt());

        if (entity.getActive() == null) {
            entity.setActive(existing.getActive());
        }

        entity.preUpdate();
        return repository.save(entity);
    }
}

