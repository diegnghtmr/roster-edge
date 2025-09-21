package co.edu.uniquindio.rosteredge.backend.model;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Stadium entity
 * Represents stadiums with area, surface, capacity and foundation information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table("Stadium")
public class Stadium extends BaseEntity {

    /**
     * Stadium area in square meters
     */
    @NotNull(message = "Area is required")
    @DecimalMin(value = "0.0", message = "Area cannot be negative")
    @DecimalMax(value = "100000.0", message = "Area cannot exceed 100,000 square meters")
    private BigDecimal area;

    /**
     * Stadium surface type
     */
    @NotBlank(message = "Surface is required")
    @Size(max = 50, message = "Surface cannot exceed 50 characters")
    private String surface;

    /**
     * Stadium total capacity
     */
    @NotNull(message = "Total capacity is required")
    private Integer totalCapacity;

    /**
     * Stadium foundation date
     */
    @NotNull(message = "Foundation date is required")
    private LocalDate foundation;

    /**
     * Venue ID
     */
    @NotNull(message = "Venue ID is required")
    private Long venueId;
}