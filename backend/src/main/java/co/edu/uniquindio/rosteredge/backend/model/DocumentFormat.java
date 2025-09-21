package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

/**
 * DocumentFormat entity
 * Represents the different formats available for documents
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("DocumentFormat")
public class DocumentFormat extends BaseEntity {

    /**
     * Document format name
     */
    @NotBlank(message = "Document format name is required")
    @Size(max = 50, message = "Document format name cannot exceed 50 characters")
    private String name;
}