package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.model.BaseEntity;
import co.edu.uniquindio.rosteredge.backend.service.CrudService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

/**
 * Shared CRUD controller exposing standard endpoints that return ApiResponse payloads.
 */
@Slf4j
public abstract class SimpleCrudController<T extends BaseEntity> {

    private final CrudService<T> service;

    protected SimpleCrudController(CrudService<T> service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<T>> create(@Valid @RequestBody T entity) {
        log.info("Creating {}", entity.getClass().getSimpleName());
        T created = service.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Resource created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<T>>> findAll() {
        List<T> items = service.findAll();
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<T>> findById(@PathVariable Long id) {
        T item = service.findByIdOrThrow(id);
        return ResponseEntity.ok(ApiResponse.success(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<T>> update(@PathVariable Long id, @Valid @RequestBody T entity) {
        T updated = service.update(id, entity);
        return ResponseEntity.ok(ApiResponse.success(updated, "Resource updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Resource deleted successfully"));
    }
}

