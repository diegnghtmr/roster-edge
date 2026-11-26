package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.request.RosterWriteRequest;
import co.edu.uniquindio.rosteredge.backend.dto.response.RosterSummaryResponse;
import co.edu.uniquindio.rosteredge.backend.exception.EntityNotFoundException;
import co.edu.uniquindio.rosteredge.backend.security.PasswordHasher;
import co.edu.uniquindio.rosteredge.backend.security.RosterPrincipal;
import co.edu.uniquindio.rosteredge.backend.service.RosterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/rosters")
@RequiredArgsConstructor
public class RosterCrudController {

    private final RosterService rosters;
    private final PasswordHasher passwords;

    @GetMapping("/")
    public ApiResponse<List<RosterSummaryResponse>> findAll(
            RosterPrincipal principal,
            @RequestParam(required = false) Long subscriptionId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate creationFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate creationTo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate lastAccessFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate lastAccessTo) {
        return ApiResponse.success(rosters.findByFilters(principal.clubId(), subscriptionId, active,
                name, email, creationFrom, creationTo, lastAccessFrom, lastAccessTo).stream()
                .map(RosterSummaryResponse::from).toList());
    }

    @GetMapping("/{id}/")
    public ApiResponse<RosterSummaryResponse> findById(@PathVariable long id) {
        return ApiResponse.success(RosterSummaryResponse.from(rosters.findByIdOrThrow(id)));
    }

    @PutMapping("/{id}/")
    public ApiResponse<RosterSummaryResponse> update(@PathVariable long id, @Valid @RequestBody RosterWriteRequest request,
                                                     RosterPrincipal principal) {
        var roster = rosters.findByIdOrThrow(id);
        if (request.subscriptionId() != null && !request.subscriptionId().equals(principal.subscriptionId())) {
            throw new EntityNotFoundException("Subscription", request.subscriptionId());
        }
        roster.setName(request.name());
        roster.setEmail(request.email());
        if (request.password() != null) {
            roster.setPasswordHash(passwords.hash(request.password()));
        }
        if (request.active() != null) {
            roster.setActive(request.active());
        }
        return ApiResponse.success(RosterSummaryResponse.from(rosters.update(id, roster)), "Resource updated successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable long id) {
        rosters.deleteById(id);
        return ApiResponse.success(null, "Resource deleted successfully");
    }
}
