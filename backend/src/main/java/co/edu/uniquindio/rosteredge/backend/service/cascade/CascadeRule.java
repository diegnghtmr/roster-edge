package co.edu.uniquindio.rosteredge.backend.service.cascade;

import lombok.Builder;
import lombok.Value;
import lombok.Builder.Default;

/**
 * Definition of how to break a relationship that points to a parent entity.
 */
@Value
@Builder
public class CascadeRule {
    /**
     * Table that stores the relationship.
     */
    String table;

    /**
     * Column that references the parent entity identifier.
     */
    String column;

    /**
     * Action to apply when clearing the association.
     */
    CascadeAction action;

    /**
     * Column that represents the identifier of the child row. Defaults to "id".
     */
    @Default
    String idColumn = "id";

    /**
     * Whether the child rows should cascade their own associations before deletion.
     */
    @Default
    boolean cascadeChildren = false;
}
