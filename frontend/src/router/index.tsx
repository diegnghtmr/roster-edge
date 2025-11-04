import { Layout } from "@/components/layout/Layout";
import NotificationsModule from "@/modules/notifications";
import UsersModule from "@/modules/users";

import Dashboard from "@/modules/dashboard/Dashboard";
import TeamCategoriesModule from "@/modules/team-categories";
import TeamCategoryCreateModule from "@/modules/team-categories/create";
import TeamCategoryUpdateModule from "@/modules/team-categories/update";
import TeamGendersModule from "@/modules/team-genders";
import TeamGenderCreateModule from "@/modules/team-genders/create";
import TeamGenderUpdateModule from "@/modules/team-genders/update";
import { TeamsModule } from "@/modules/teams";
import TeamCreateModule from "@/modules/teams/create";
import TeamUpdateModule from "@/modules/teams/update";
import { StaffModule } from "@/modules/staff";
import StaffCreateModule from "@/modules/staff/create";
import StaffUpdateModule from "@/modules/staff/update";
import { StaffRolesModule } from "@/modules/staff-roles";
import StaffRoleCreateModule from "@/modules/staff-roles/create";
import StaffRoleUpdateModule from "@/modules/staff-roles/update";
import CitiesModule from "@/modules/cities";
import CityCreateModule from "@/modules/cities/create";
import CityUpdateModule from "@/modules/cities/update";
import CountriesModule from "@/modules/countries";
import CountryCreateModule from "@/modules/countries/create";
import CountryUpdateModule from "@/modules/countries/update";
import CurrenciesModule from "@/modules/currencies";
import CurrencyCreateModule from "@/modules/currencies/create";
import CurrencyUpdateModule from "@/modules/currencies/update";
import StadiumsModule from "@/modules/stadiums";
import StadiumCreateModule from "@/modules/stadiums/create";
import StadiumUpdateModule from "@/modules/stadiums/update";
import SeasonsModule from "@/modules/seasons";
import SeasonCreateModule from "@/modules/seasons/create";
import SeasonUpdateModule from "@/modules/seasons/update";
import EventsModule from "@/modules/events";
import EventCreateModule from "@/modules/events/create";
import EventUpdateModule from "@/modules/events/update";
import MatchdaysModule from "@/modules/matchdays";
import MatchdayCreateModule from "@/modules/matchdays/create";
import MatchdayUpdateModule from "@/modules/matchdays/update";
import MatchesModule from "@/modules/matches";
import MatchCreateModule from "@/modules/matches/create";
import MatchUpdateModule from "@/modules/matches/update";
import { VenuesModule } from "@/modules/venues";
import { CreateVenue } from "@/modules/venues/create";
import { UpdateVenue } from "@/modules/venues/update";
import Contact from "@/modules/contact/Contact";
import Support from "@/modules/support/Support";
import { ReportsModule } from "@/modules/reports";
import { SeasonStandingsReport } from "@/modules/reports/season-standings";
import { RosterProfileReport } from "@/modules/reports/roster-profile";
import { ScoringRankingReport } from "@/modules/reports/scoring-ranking";
import { PointsProgressReport } from "@/modules/reports/points-progress";
import { MatchLoadReport } from "@/modules/reports/match-load";
import { StaffRatioReport } from "@/modules/reports/staff-ratio";
import { StaffImpactReport } from "@/modules/reports/staff-impact";
import { SeasonAgendaReport } from "@/modules/reports/season-agenda";
import { CategoryParticipationReport } from "@/modules/reports/category-participation";
import { ScheduleDensityReport } from "@/modules/reports/schedule-density";
import ErrorPage from "@/page/ErrorPage";
import Login from "@/page/login/Login";
import { createBrowserRouter, Navigate } from "react-router-dom";

export default function useRouterApp() {
  const isUserLoggedIn = Boolean(localStorage.getItem("token"));

  return createBrowserRouter([
    {
      path: "/",
      element: isUserLoggedIn ? <Layout /> : <Navigate to="/login" />,
      errorElement: <ErrorPage />,
      children: isUserLoggedIn
        ? [
            {
              path: "",
              element: <Navigate to="/dashboard" />,
            },
            {
              path: "/dashboard",
              element: <Dashboard />,
            },

            {
              path: "/teams",
              element: <TeamsModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/teams-create",
              element: <TeamCreateModule />,
            },
            {
              path: "/teams/:id/edit",
              element: <TeamUpdateModule />,
            },

            {
              path: "/staff",
              element: <StaffModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/staff-create",
              element: <StaffCreateModule />,
            },
            {
              path: "/staff/:id/edit",
              element: <StaffUpdateModule />,
            },
            {
              path: "/staff-roles",
              element: <StaffRolesModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/staff-roles-create",
              element: <StaffRoleCreateModule />,
            },
            {
              path: "/staff-roles/:id/edit",
              element: <StaffRoleUpdateModule />,
            },
            {
              path: "/team-categories",
              element: <TeamCategoriesModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/team-categories-create",
              element: <TeamCategoryCreateModule />,
            },
            {
              path: "/team-categories/:id/edit",
              element: <TeamCategoryUpdateModule />,
            },
            {
              path: "/team-genders",
              element: <TeamGendersModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/team-genders-create",
              element: <TeamGenderCreateModule />,
            },
            {
              path: "/team-genders/:id/edit",
              element: <TeamGenderUpdateModule />,
            },
            {
              path: "/cities",
              element: <CitiesModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/cities-create",
              element: <CityCreateModule />,
            },
            {
              path: "/cities/:id/edit",
              element: <CityUpdateModule />,
            },
            {
              path: "/countries",
              element: <CountriesModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/countries-create",
              element: <CountryCreateModule />,
            },
            {
              path: "/countries/:id/edit",
              element: <CountryUpdateModule />,
            },
            {
              path: "/currencies",
              element: <CurrenciesModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/currencies-create",
              element: <CurrencyCreateModule />,
            },
            {
              path: "/currencies/:id/edit",
              element: <CurrencyUpdateModule />,
            },
            {
              path: "/stadiums",
              element: <StadiumsModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/stadiums-create",
              element: <StadiumCreateModule />,
            },
            {
              path: "/stadiums/:id/edit",
              element: <StadiumUpdateModule />,
            },
            {
              path: "/seasons",
              element: <SeasonsModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/seasons-create",
              element: <SeasonCreateModule />,
            },
            {
              path: "/seasons/:id/edit",
              element: <SeasonUpdateModule />,
            },
            {
              path: "/events",
              element: <EventsModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/events-create",
              element: <EventCreateModule />,
            },
            {
              path: "/events/:id/edit",
              element: <EventUpdateModule />,
            },
            {
              path: "/matchdays",
              element: <MatchdaysModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/matchdays-create",
              element: <MatchdayCreateModule />,
            },
            {
              path: "/matchdays/:id/edit",
              element: <MatchdayUpdateModule />,
            },
            {
              path: "/matches",
              element: <MatchesModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/matches-create",
              element: <MatchCreateModule />,
            },
            {
              path: "/matches/:id/edit",
              element: <MatchUpdateModule />,
            },
            {
              path: "/venues",
              element: <VenuesModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/venues-create",
              element: <CreateVenue />,
            },
            {
              path: "/venues/:id/edit",
              element: <UpdateVenue />,
            },
            {
              path: "/notifications",
              element: <NotificationsModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/users",
              element: <UsersModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/contact",
              element: <Contact />,
            },
            {
              path: "/support",
              element: <Support />,
            },
            {
              path: "/reports",
              element: <ReportsModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/reports/season-standings",
              element: <SeasonStandingsReport />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/reports/roster-profile",
              element: <RosterProfileReport />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/reports/scoring-ranking",
              element: <ScoringRankingReport />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/reports/points-progress",
              element: <PointsProgressReport />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/reports/match-load",
              element: <MatchLoadReport />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/reports/staff-ratio",
              element: <StaffRatioReport />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/reports/staff-impact",
              element: <StaffImpactReport />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/reports/season-agenda",
              element: <SeasonAgendaReport />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/reports/category-participation",
              element: <CategoryParticipationReport />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/reports/schedule-density",
              element: <ScheduleDensityReport />,
              errorElement: <ErrorPage />,
            },
          ]
        : [],
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
  ]);
}
