package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.dto.ClubDTO;
import co.edu.uniquindio.rosteredge.backend.exception.EntityNotFoundException;
import co.edu.uniquindio.rosteredge.backend.mapper.EntityMapper;
import co.edu.uniquindio.rosteredge.backend.model.Club;
import co.edu.uniquindio.rosteredge.backend.repository.ClubRepository;
import co.edu.uniquindio.rosteredge.backend.service.AbstractBaseService;
import co.edu.uniquindio.rosteredge.backend.service.ClubService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class ClubServiceImpl extends AbstractBaseService<Club, Long> implements ClubService {

    private final ClubRepository clubRepository;
    private final EntityMapper mapper;

    public ClubServiceImpl(ClubRepository clubRepository, EntityMapper mapper) {
        super(clubRepository);
        this.clubRepository = clubRepository;
        this.mapper = mapper;
    }

    @Override
    protected String getEntityName() {
        return "Club";
    }

    @Override
    public ClubDTO createClub(ClubDTO clubDTO) {
        log.info("Creating club: {}", clubDTO.getName());
        Club club = mapper.toClubEntity(clubDTO);
        Club savedClub = save(club);
        return mapper.toClubDTO(savedClub);
    }

    @Override
    public List<ClubDTO> findAllClubs(String name, Boolean active, LocalDate foundationFrom, LocalDate foundationTo) {
        log.info("Finding clubs with filters - name: {}, active: {}, foundationFrom: {}, foundationTo: {}",
                name, active, foundationFrom, foundationTo);
        return clubRepository.findByFilters(name, active, foundationFrom, foundationTo).stream()
                .map(mapper::toClubDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ClubDTO findClubById(Long id) {
        log.info("Finding club with id: {}", id);
        return clubRepository.findById(id)
                .map(mapper::toClubDTO)
                .orElseThrow(() -> new EntityNotFoundException(getEntityName(), id));
    }

    @Override
    public ClubDTO updateClub(Long id, ClubDTO clubDTO) {
        log.info("Updating club with id: {}", id);
        Club existingClub = clubRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(getEntityName(), id));

        existingClub.setName(clubDTO.getName());
        existingClub.setMotto(clubDTO.getMotto());
        existingClub.setFoundation(clubDTO.getFoundation());

        Club updatedClub = save(existingClub);
        return mapper.toClubDTO(updatedClub);
    }

    @Override
    public void deleteClub(Long id) {
        log.info("Deleting club with id: {}", id);
        if (!clubRepository.existsById(id)) {
            throw new EntityNotFoundException(getEntityName(), id);
        }
        clubRepository.deleteById(id);
    }
}
