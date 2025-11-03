package co.edu.uniquindio.rosteredge.backend.service;

import co.edu.uniquindio.rosteredge.backend.dto.VenueDTO;
import co.edu.uniquindio.rosteredge.backend.model.Venue;
import java.time.LocalDate;
import java.util.List;

public interface VenueService extends BaseService<Venue, Long> {
    VenueDTO createVenue(VenueDTO venueDTO);
    List<VenueDTO> findAllVenues(String name, String email, Long cityId, Long clubId, Boolean active, LocalDate foundationFrom, LocalDate foundationTo);
    VenueDTO findVenueById(Long id);
    VenueDTO updateVenue(Long id, VenueDTO venueDTO);
    void deleteVenue(Long id);
}