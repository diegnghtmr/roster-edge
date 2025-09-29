package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.dto.SeasonDTO;
import co.edu.uniquindio.rosteredge.backend.exception.EntityNotFoundException;
import co.edu.uniquindio.rosteredge.backend.mapper.EntityMapper;
import co.edu.uniquindio.rosteredge.backend.model.Season;
import co.edu.uniquindio.rosteredge.backend.repository.SeasonRepository;
import co.edu.uniquindio.rosteredge.backend.service.AbstractBaseService;
import co.edu.uniquindio.rosteredge.backend.service.SeasonService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class SeasonServiceImpl extends AbstractBaseService<Season, Long> implements SeasonService {

    private final SeasonRepository seasonRepository;
    private final EntityMapper mapper;

    public SeasonServiceImpl(SeasonRepository seasonRepository, EntityMapper mapper) {
        super(seasonRepository);
        this.seasonRepository = seasonRepository;
        this.mapper = mapper;
    }

    @Override
    protected String getEntityName() {
        return "Season";
    }

    @Override
    public SeasonDTO createSeason(SeasonDTO seasonDTO) {
        log.info("Creating season: {}", seasonDTO.getName());
        Season season = mapper.toSeasonEntity(seasonDTO);
        Season savedSeason = save(season);
        return mapper.toSeasonDTO(savedSeason);
    }

    @Override
    public List<SeasonDTO> findAllSeasons(Long clubId, String name, Boolean active,
                                          LocalDate startDateFrom, LocalDate startDateTo,
                                          LocalDate endDateFrom, LocalDate endDateTo) {
        log.info("Finding seasons with filters - clubId: {}, name: {}, active: {}, startDateFrom: {}, startDateTo: {}, endDateFrom: {}, endDateTo: {}",
                clubId, name, active, startDateFrom, startDateTo, endDateFrom, endDateTo);
        return seasonRepository.findByFilters(clubId, name, active, startDateFrom, startDateTo, endDateFrom, endDateTo).stream()
                .map(mapper::toSeasonDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SeasonDTO findSeasonById(Long id) {
        log.info("Finding season with id: {}", id);
        return seasonRepository.findById(id)
                .map(mapper::toSeasonDTO)
                .orElseThrow(() -> new EntityNotFoundException(getEntityName(), id));
    }

    @Override
    public SeasonDTO updateSeason(Long id, SeasonDTO seasonDTO) {
        log.info("Updating season with id: {}", id);
        Season existingSeason = seasonRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(getEntityName(), id));

        existingSeason.setClubId(seasonDTO.getClubId());
        existingSeason.setName(seasonDTO.getName());
        existingSeason.setStartDate(seasonDTO.getStartDate());
        existingSeason.setEndDate(seasonDTO.getEndDate());

        Season updatedSeason = save(existingSeason);
        return mapper.toSeasonDTO(updatedSeason);
    }

    @Override
    public void deleteSeason(Long id) {
        log.info("Deleting season with id: {}", id);
        if (!seasonRepository.existsById(id)) {
            throw new EntityNotFoundException(getEntityName(), id);
        }
        seasonRepository.deleteById(id);
    }
}
