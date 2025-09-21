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
 * DocumentType entity
 * Represents the different types of documents
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("DocumentType")
public class DocumentType extends BaseEntity {

    /**
     * Document type name
     */
    @NotBlank(message = "Document type name is required")
    @Size(max = 50, message = "Document type name cannot exceed 50 characters")
    private String name;
}