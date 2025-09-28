package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.model.BaseEntity;

/**
 * Generic CRUD service contract for entities that extend BaseEntity.
 */
public interface CrudService<T extends BaseEntity> extends BaseService<T, Long> {
}

