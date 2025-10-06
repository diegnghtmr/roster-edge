package co.edu.uniquindio.rosteredge.backend.service.cascade;

/**
 * Actions that can be applied when clearing associations before deleting an entity.
 */
public enum CascadeAction {

    /**
     * Set the foreign key to null to preserve the child entity.
     */
    SET_NULL,

    /**
     * Remove the relationship row entirely when it represents a pure association.
     */
    DELETE
}
