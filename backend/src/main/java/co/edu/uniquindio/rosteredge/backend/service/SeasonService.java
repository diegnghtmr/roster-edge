package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.dto.SeasonDTO;
import co.edu.uniquindio.rosteredge.backend.model.Season;

import java.util.List;

public interface SeasonService extends BaseService<Season, Long> {
    SeasonDTO createSeason(SeasonDTO seasonDTO);
    List<SeasonDTO> findAllSeasons();
    SeasonDTO findSeasonById(Long id);
    SeasonDTO updateSeason(Long id, SeasonDTO seasonDTO);
    void deleteSeason(Long id);
}
