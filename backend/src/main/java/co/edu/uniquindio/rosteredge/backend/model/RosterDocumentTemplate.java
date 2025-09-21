package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

/**
 * RosterDocumentTemplate entity
 * Represents relationship between rosters and document templates
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("RosterDocumentTemplate")
public class RosterDocumentTemplate extends BaseEntity {

    /**
     * Roster ID
     */
    @NotNull(message = "Roster ID is required")
    private Long rosterId;

    /**
     * Document template ID
     */
    @NotNull(message = "Document template ID is required")
    private Long documentTemplateId;
}