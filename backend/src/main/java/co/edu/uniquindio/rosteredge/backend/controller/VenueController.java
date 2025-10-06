package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.controller.BaseController;
import co.edu.uniquindio.rosteredge.backend.dto.VenueDTO;
import co.edu.uniquindio.rosteredge.backend.service.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/venues")
@RequiredArgsConstructor
@Slf4j
public class VenueController extends BaseController {

    private final VenueService venueService;

    @PostMapping("/")
    public ResponseEntity<ApiResponse<VenueDTO>> createVenue(@Valid @RequestBody VenueDTO venueDTO) {
        log.info("Request to create venue: {}", venueDTO.getName());
        VenueDTO createdVenue = venueService.createVenue(venueDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdVenue, "Venue created successfully"));
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<VenueDTO>>> getAllVenues(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) Long clubId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate foundationFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate foundationTo) {
        log.info("Request to get venues with filters - name: {}, email: {}, cityId: {}, clubId: {}, active: {}, foundationFrom: {}, foundationTo: {}",
                name, email, cityId, clubId, active, foundationFrom, foundationTo);
        List<VenueDTO> venues = venueService.findAllVenues(name, email, cityId, clubId, active, foundationFrom, foundationTo);
        return ResponseEntity.ok(ApiResponse.success(venues));
    }

    @GetMapping("/{id}/")
    public ResponseEntity<ApiResponse<VenueDTO>> getVenueById(@PathVariable Long id) {
        log.info("Request to get venue by id: {}", id);
        VenueDTO venue = venueService.findVenueById(id);
        return ResponseEntity.ok(ApiResponse.success(venue));
    }

    @PutMapping("/{id}/")
    public ResponseEntity<ApiResponse<VenueDTO>> updateVenue(@PathVariable Long id, @Valid @RequestBody VenueDTO venueDTO) {
        log.info("Request to update venue with id: {}", id);
        VenueDTO updatedVenue = venueService.updateVenue(id, venueDTO);
        return ResponseEntity.ok(ApiResponse.success(updatedVenue, "Venue updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVenue(@PathVariable Long id) {
        log.info("Request to delete venue with id: {}", id);
        venueService.deleteVenue(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Venue deleted successfully"));
    }
}