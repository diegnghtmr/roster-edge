package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

/**
 * DocumentTemplate entity
 * Represents document templates
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("DocumentTemplate")
public class DocumentTemplate extends BaseEntity {

    /**
     * Template name
     */
    @NotBlank(message = "Template name is required")
    @Size(max = 120, message = "Template name cannot exceed 120 characters")
    private String name;

    /**
     * Template description
     */
    @NotBlank(message = "Description is required")
    @Size(max = 120, message = "Description cannot exceed 120 characters")
    private String description;

    /**
     * Document format ID
     */
    @NotNull(message = "Document format ID is required")
    private Long documentFormatId;

    /**
     * Document type ID
     */
    @NotNull(message = "Document type ID is required")
    private Long documentTypeId;

    /**
     * Template content
     */
    @NotBlank(message = "Content is required")
    private String content;

    /**
     * Creation timestamp
     */
    private LocalDateTime creation;
}