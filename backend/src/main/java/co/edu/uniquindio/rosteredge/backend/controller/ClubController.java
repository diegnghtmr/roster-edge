package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.ClubDTO;
import co.edu.uniquindio.rosteredge.backend.service.ClubService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clubs")
@RequiredArgsConstructor
@Slf4j
public class ClubController extends BaseController {

    private final ClubService clubService;

    @PostMapping
    public ResponseEntity<ApiResponse<ClubDTO>> createClub(@Valid @RequestBody ClubDTO clubDTO) {
        log.info("Request to create club: {}", clubDTO.getName());
        ClubDTO createdClub = clubService.createClub(clubDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdClub, "Club created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClubDTO>>> getAllClubs() {
        log.info("Request to get all clubs");
        List<ClubDTO> clubs = clubService.findAllClubs();
        return ResponseEntity.ok(ApiResponse.success(clubs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClubDTO>> getClubById(@PathVariable Long id) {
        log.info("Request to get club by id: {}", id);
        ClubDTO club = clubService.findClubById(id);
        return ResponseEntity.ok(ApiResponse.success(club));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClubDTO>> updateClub(@PathVariable Long id, @Valid @RequestBody ClubDTO clubDTO) {
        log.info("Request to update club with id: {}", id);
        ClubDTO updatedClub = clubService.updateClub(id, clubDTO);
        return ResponseEntity.ok(ApiResponse.success(updatedClub, "Club updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteClub(@PathVariable Long id) {
        log.info("Request to delete club with id: {}", id);
        clubService.deleteClub(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Club deleted successfully"));
    }
}
