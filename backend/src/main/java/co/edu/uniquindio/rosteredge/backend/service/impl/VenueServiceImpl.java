package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.dto.VenueDTO;
import co.edu.uniquindio.rosteredge.backend.exception.EntityNotFoundException;
import co.edu.uniquindio.rosteredge.backend.mapper.EntityMapper;
import co.edu.uniquindio.rosteredge.backend.model.Venue;
import co.edu.uniquindio.rosteredge.backend.repository.VenueRepository;
import co.edu.uniquindio.rosteredge.backend.service.AbstractBaseService;
import co.edu.uniquindio.rosteredge.backend.service.VenueService;
import co.edu.uniquindio.rosteredge.backend.util.FilterUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class VenueServiceImpl extends AbstractBaseService<Venue, Long> implements VenueService {

    private final VenueRepository venueRepository;
    private final EntityMapper mapper;

    public VenueServiceImpl(VenueRepository venueRepository, EntityMapper mapper) {
        super(venueRepository);
        this.venueRepository = venueRepository;
        this.mapper = mapper;
    }

    @Override
    protected String getEntityName() {
        return "Venue";
    }

    @Override
    public VenueDTO createVenue(VenueDTO venueDTO) {
        log.info("Creating venue: {}", venueDTO.getName());
        Venue venue = mapper.toVenueEntity(venueDTO);
        Venue savedVenue = save(venue);
        return mapper.toVenueDTO(savedVenue);
    }

    @Override
    public List<VenueDTO> findAllVenues(String name, String email, Long cityId, Long clubId, Boolean active, LocalDate foundationFrom, LocalDate foundationTo) {
        Boolean effectiveActive = FilterUtils.resolveActive(active);
        log.info("Finding venues with filters - name: {}, email: {}, cityId: {}, clubId: {}, active: {}, foundationFrom: {}, foundationTo: {}",
                name, email, cityId, clubId, effectiveActive, foundationFrom, foundationTo);
        return venueRepository.findByFilters(name, email, cityId, clubId, effectiveActive, foundationFrom, foundationTo).stream()
                .map(mapper::toVenueDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VenueDTO findVenueById(Long id) {
        log.info("Finding venue with id: {}", id);
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(getEntityName(), id));

        if (!Boolean.TRUE.equals(venue.getActive())) {
            throw new EntityNotFoundException(getEntityName(), id);
        }

        return mapper.toVenueDTO(venue);
    }

    @Override
    public VenueDTO updateVenue(Long id, VenueDTO venueDTO) {
        log.info("Updating venue with id: {}", id);
        Venue existingVenue = venueRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(getEntityName(), id));

        if (!Boolean.TRUE.equals(existingVenue.getActive())) {
            throw new EntityNotFoundException(getEntityName(), id);
        }

        existingVenue.setName(venueDTO.getName());
        existingVenue.setEmail(venueDTO.getEmail());
        existingVenue.setCityId(venueDTO.getCityId());
        existingVenue.setFoundation(venueDTO.getFoundation());
        existingVenue.setPhone(venueDTO.getPhone());
        existingVenue.setClubId(venueDTO.getClubId());

        Venue updatedVenue = save(existingVenue);
        return mapper.toVenueDTO(updatedVenue);
    }

    @Override
    public void deleteVenue(Long id) {
        log.info("Deleting venue with id: {}", id);
        super.deleteById(id);
    }
}

