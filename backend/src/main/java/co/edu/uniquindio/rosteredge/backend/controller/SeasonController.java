package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.dto.ApiResponse;
import co.edu.uniquindio.rosteredge.backend.dto.SeasonDTO;
import co.edu.uniquindio.rosteredge.backend.service.SeasonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seasons")
@RequiredArgsConstructor
@Slf4j
public class SeasonController extends BaseController {

    private final SeasonService seasonService;

    @PostMapping
    public ResponseEntity<ApiResponse<SeasonDTO>> createSeason(@Valid @RequestBody SeasonDTO seasonDTO) {
        log.info("Request to create season: {}", seasonDTO.getName());
        SeasonDTO createdSeason = seasonService.createSeason(seasonDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdSeason, "Season created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SeasonDTO>>> getAllSeasons() {
        log.info("Request to get all seasons");
        List<SeasonDTO> seasons = seasonService.findAllSeasons();
        return ResponseEntity.ok(ApiResponse.success(seasons));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SeasonDTO>> getSeasonById(@PathVariable Long id) {
        log.info("Request to get season by id: {}", id);
        SeasonDTO season = seasonService.findSeasonById(id);
        return ResponseEntity.ok(ApiResponse.success(season));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SeasonDTO>> updateSeason(@PathVariable Long id, @Valid @RequestBody SeasonDTO seasonDTO) {
        log.info("Request to update season with id: {}", id);
        SeasonDTO updatedSeason = seasonService.updateSeason(id, seasonDTO);
        return ResponseEntity.ok(ApiResponse.success(updatedSeason, "Season updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSeason(@PathVariable Long id) {
        log.info("Request to delete season with id: {}", id);
        seasonService.deleteSeason(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Season deleted successfully"));
    }
}
