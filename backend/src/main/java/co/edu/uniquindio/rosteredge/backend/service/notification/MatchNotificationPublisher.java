package co.edu.uniquindio.rosteredge.backend.service.notification;

import co.edu.uniquindio.rosteredge.backend.model.Club;
import co.edu.uniquindio.rosteredge.backend.model.ClubEvent;
import co.edu.uniquindio.rosteredge.backend.model.Event;
import co.edu.uniquindio.rosteredge.backend.model.Match;
import co.edu.uniquindio.rosteredge.backend.model.MatchAwayTeam;
import co.edu.uniquindio.rosteredge.backend.model.MatchHomeTeam;
import co.edu.uniquindio.rosteredge.backend.model.Matchday;
import co.edu.uniquindio.rosteredge.backend.model.Notification;
import co.edu.uniquindio.rosteredge.backend.model.Season;
import co.edu.uniquindio.rosteredge.backend.model.Stadium;
import co.edu.uniquindio.rosteredge.backend.model.Team;
import co.edu.uniquindio.rosteredge.backend.repository.ClubEventRepository;
import co.edu.uniquindio.rosteredge.backend.repository.ClubRepository;
import co.edu.uniquindio.rosteredge.backend.repository.EventRepository;
import co.edu.uniquindio.rosteredge.backend.repository.MatchAwayTeamRepository;
import co.edu.uniquindio.rosteredge.backend.repository.MatchHomeTeamRepository;
import co.edu.uniquindio.rosteredge.backend.repository.MatchdayRepository;
import co.edu.uniquindio.rosteredge.backend.repository.SeasonRepository;
import co.edu.uniquindio.rosteredge.backend.repository.StadiumRepository;
import co.edu.uniquindio.rosteredge.backend.repository.VenueRepository;
import co.edu.uniquindio.rosteredge.backend.repository.TeamRepository;
import co.edu.uniquindio.rosteredge.backend.service.NotificationService;
import co.edu.uniquindio.rosteredge.backend.model.Venue;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Helper component that builds and stores notifications whenever a match is scheduled.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class MatchNotificationPublisher {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    private final EventRepository eventRepository;
    private final SeasonRepository seasonRepository;
    private final MatchdayRepository matchdayRepository;
    private final StadiumRepository stadiumRepository;
    private final VenueRepository venueRepository;
    private final MatchHomeTeamRepository matchHomeTeamRepository;
    private final MatchAwayTeamRepository matchAwayTeamRepository;
    private final TeamRepository teamRepository;
    private final ClubRepository clubRepository;
    private final ClubEventRepository clubEventRepository;
    private final NotificationService notificationService;
    private final NotificationClubEventLinkService notificationClubEventLinkService;

    /**
     * Publishes a notification describing the match that has just been created.
     *
     * @param match persisted match entity
     */
    public void publishMatchScheduled(Match match) {
        if (match == null || match.getEventId() == null) {
            log.debug("Skipping notification for match without event information");
            return;
        }
        try {
            Optional<Event> eventOpt = eventRepository.findById(match.getEventId());
            if (eventOpt.isEmpty()) {
                log.warn("Unable to publish notification. Event {} not found for match {}", match.getEventId(), match.getId());
                return;
            }

            Event event = eventOpt.get();
            Season season = event.getSeasonId() != null ? seasonRepository.findById(event.getSeasonId()).orElse(null) : null;
            Matchday matchday = matchdayRepository.findById(match.getMatchdayId()).orElse(null);
            Stadium stadium = stadiumRepository.findById(match.getStadiumId()).orElse(null);
            Venue venue = (stadium != null && stadium.getVenueId() != null)
                    ? venueRepository.findById(stadium.getVenueId()).orElse(null)
                    : null;

            TeamContext homeTeam = resolveTeam(match.getId(), true);
            TeamContext awayTeam = resolveTeam(match.getId(), false);
            List<ClubEvent> clubEvents = clubEventRepository.findByFilters(null, event.getId(), Boolean.TRUE);

            String message = buildMessage(event, season, matchday, venue, match, homeTeam, awayTeam, clubEvents);
            Notification notification = Notification.builder()
                    .message(message)
                    .sendDate(resolveSendDate(match.getDate(), match.getStartTime()))
                    .active(Boolean.TRUE)
                    .build();

            Notification savedNotification = notificationService.save(notification);
            linkNotificationToClubs(savedNotification.getId(), event.getId(), homeTeam, awayTeam, clubEvents);
        } catch (Exception ex) {
            log.error("Unable to publish notification for match {}", match.getId(), ex);
        }
    }

    private void linkNotificationToClubs(Long notificationId,
                                         Long eventId,
                                         TeamContext homeTeam,
                                         TeamContext awayTeam,
                                         List<ClubEvent> eventClubs) {
        if (notificationId == null) {
            return;
        }

        java.util.Set<Long> linkedClubEvents = new java.util.HashSet<>();

        linkNotificationToClub(notificationId, eventId, homeTeam)
                .ifPresent(linkedClubEvents::add);
        linkNotificationToClub(notificationId, eventId, awayTeam)
                .ifPresent(linkedClubEvents::add);

        if (eventClubs != null) {
            for (ClubEvent clubEvent : eventClubs) {
                if (clubEvent.getId() == null || linkedClubEvents.contains(clubEvent.getId())) {
                    continue;
                }
                notificationClubEventLinkService.link(notificationId, clubEvent.getId());
                linkedClubEvents.add(clubEvent.getId());
            }
        }
    }

    private Optional<Long> linkNotificationToClub(Long notificationId, Long eventId, TeamContext teamContext) {
        if (teamContext == null || teamContext.clubId == null || notificationId == null || eventId == null) {
            return Optional.empty();
        }

        ClubEvent clubEvent = clubEventRepository
                .findByFilters(teamContext.clubId, eventId, null)
                .stream()
                .findFirst()
                .orElseGet(() -> clubEventRepository.save(ClubEvent.builder()
                        .clubId(teamContext.clubId)
                        .eventId(eventId)
                        .active(Boolean.TRUE)
                        .build()));

        notificationClubEventLinkService.link(notificationId, clubEvent.getId());
        return Optional.of(clubEvent.getId());
    }

    private String buildMessage(Event event,
                                Season season,
                                Matchday matchday,
                                Venue venue,
                                Match match,
                                TeamContext homeTeam,
                                TeamContext awayTeam,
                                List<ClubEvent> clubEvents) {

        String seasonName = season != null ? season.getName() : "Temporada por definir";
        String homeLabel = resolveTeamLabel(homeTeam, "Equipo local", clubEvents, 0);
        String awayLabel = resolveTeamLabel(awayTeam, "Equipo visitante", clubEvents, 1);
        String eventDisplay = event.getName();

        if (homeLabel != null && awayLabel != null) {
            eventDisplay = String.format("%s - %s vs %s", eventDisplay, homeLabel, awayLabel);
        }
        eventDisplay = String.format("%s (%s)", eventDisplay, seasonName);

        String matchdayText = matchday != null ? "Jornada " + matchday.getName() + ". " : "";
        String venueText = venue != null ? venue.getName() : "escenario por definir";
        String dateText = match.getDate() != null ? match.getDate().format(DATE_FORMAT) : "fecha por definir";
        String timeText = match.getStartTime() != null ? match.getStartTime().format(TIME_FORMAT) : "hora por definir";

        return String.format(
                "Evento %s. %sEl partido se jugará el %s a las %s en %s.",
                eventDisplay,
                matchdayText,
                dateText,
                timeText,
                venueText
        );
    }

    private String resolveTeamLabel(TeamContext context,
                                    String defaultLabel,
                                    List<ClubEvent> eventClubs,
                                    int fallbackIndex) {
        if (context != null && context.teamName != null) {
            if (context.clubName != null) {
                return context.teamName + " (" + context.clubName + ")";
            }
            return context.teamName;
        }

        if (eventClubs != null && fallbackIndex < eventClubs.size()) {
            Long clubId = eventClubs.get(fallbackIndex).getClubId();
            if (clubId != null) {
                return clubRepository.findById(clubId)
                        .map(Club::getName)
                        .orElse(defaultLabel);
            }
        }
        return defaultLabel;
    }

    private TeamContext resolveTeam(Long matchId, boolean home) {
        List<Long> teamIds;
        if (home) {
            List<MatchHomeTeam> homeEntries = matchHomeTeamRepository.findByFilters(matchId, null, Boolean.TRUE);
            teamIds = homeEntries.stream()
                    .map(MatchHomeTeam::getTeamId)
                    .filter(Objects::nonNull)
                    .toList();
        } else {
            List<MatchAwayTeam> awayEntries = matchAwayTeamRepository.findByFilters(matchId, null, Boolean.TRUE);
            teamIds = awayEntries.stream()
                    .map(MatchAwayTeam::getTeamId)
                    .filter(Objects::nonNull)
                    .toList();
        }

        if (teamIds.isEmpty()) {
            return null;
        }

        Long teamId = teamIds.get(0);
        if (teamId == null) {
            return null;
        }

        Team team = teamRepository.findById(teamId).orElse(null);
        if (team == null) {
            return new TeamContext(teamId, null, null, null);
        }
        Club club = clubRepository.findById(team.getClubId()).orElse(null);
        return new TeamContext(teamId, team.getName(), team.getClubId(), club != null ? club.getName() : null);
    }

    private LocalDateTime resolveSendDate(LocalDate date, LocalTime time) {
        if (date == null && time == null) {
            return LocalDateTime.now();
        }
        LocalDate effectiveDate = date != null ? date : LocalDate.now();
        LocalTime effectiveTime = time != null ? time : LocalTime.MIDNIGHT;
        return LocalDateTime.of(effectiveDate, effectiveTime);
    }

    private record TeamContext(Long teamId, String teamName, Long clubId, String clubName) {
    }
}
