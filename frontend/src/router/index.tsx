import type { ComponentType } from 'react';
import { createBrowserRouter, matchRoutes, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Spinner } from '@/components/ui/spinner';
import ErrorPage from '@/page/ErrorPage';
import Login from '@/page/login/Login';

function page(path: string, load: () => Promise<ComponentType>, ownErrorBoundary = false): RouteObject {
  return {
    path,
    lazy: async () => ({ Component: await load() }),
    ...(ownErrorBoundary && { errorElement: <ErrorPage /> }),
  };
}

const protectedRoute: RouteObject = {
  path: '/',
  element: <Layout />,
  errorElement: <ErrorPage />,
  hydrateFallbackElement: (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner />
    </div>
  ),
  children: [
    { index: true, element: <Navigate to="/dashboard" replace /> },
    page('/dashboard', () => import('@/modules/dashboard/Dashboard').then((m) => m.default)),

    page('/teams', () => import('@/modules/teams').then((m) => m.TeamsModule), true),
    page('/teams-create', () => import('@/modules/teams/create').then((m) => m.default)),
    page('/teams/:id/edit', () => import('@/modules/teams/update').then((m) => m.default)),

    page('/staff', () => import('@/modules/staff').then((m) => m.StaffModule), true),
    page('/staff-create', () => import('@/modules/staff/create').then((m) => m.default)),
    page('/staff/:id/edit', () => import('@/modules/staff/update').then((m) => m.default)),
    page('/staff-roles', () => import('@/modules/staff-roles').then((m) => m.StaffRolesModule)),
    { path: '/staff-roles-create', element: <Navigate to="/staff-roles" replace /> },
    { path: '/staff-roles/:id/edit', element: <Navigate to="/staff-roles" replace /> },

    page('/team-categories', () => import('@/modules/team-categories').then((m) => m.default)),
    page('/team-categories-create', () => import('@/modules/team-categories/create').then((m) => m.default)),
    page('/team-categories/:id/edit', () => import('@/modules/team-categories/update').then((m) => m.default)),
    page('/team-genders', () => import('@/modules/team-genders').then((m) => m.default), true),
    page('/team-genders-create', () => import('@/modules/team-genders/create').then((m) => m.default)),
    page('/team-genders/:id/edit', () => import('@/modules/team-genders/update').then((m) => m.default)),

    page('/cities', () => import('@/modules/cities').then((m) => m.default), true),
    page('/cities-create', () => import('@/modules/cities/create').then((m) => m.default)),
    page('/cities/:id/edit', () => import('@/modules/cities/update').then((m) => m.default)),

    page('/countries', () => import('@/modules/countries').then((m) => m.default), true),
    page('/countries-create', () => import('@/modules/countries/create').then((m) => m.default)),
    page('/countries/:id/edit', () => import('@/modules/countries/update').then((m) => m.default)),

    page('/currencies', () => import('@/modules/currencies').then((m) => m.default), true),
    page('/currencies-create', () => import('@/modules/currencies/create').then((m) => m.default)),
    page('/currencies/:id/edit', () => import('@/modules/currencies/update').then((m) => m.default)),

    page('/stadiums', () => import('@/modules/stadiums').then((m) => m.default), true),
    page('/stadiums-create', () => import('@/modules/stadiums/create').then((m) => m.default)),
    page('/stadiums/:id/edit', () => import('@/modules/stadiums/update').then((m) => m.default)),

    page('/seasons', () => import('@/modules/seasons').then((m) => m.default)),
    page('/seasons-create', () => import('@/modules/seasons/create').then((m) => m.default)),
    page('/seasons/:id/edit', () => import('@/modules/seasons/update').then((m) => m.default)),

    page('/events', () => import('@/modules/events').then((m) => m.default)),
    page('/events-create', () => import('@/modules/events/create').then((m) => m.default)),
    page('/events/:id/edit', () => import('@/modules/events/update').then((m) => m.default)),

    page('/matchdays', () => import('@/modules/matchdays').then((m) => m.default)),
    page('/matchdays-create', () => import('@/modules/matchdays/create').then((m) => m.default)),
    page('/matchdays/:id/edit', () => import('@/modules/matchdays/update').then((m) => m.default)),

    page('/matches', () => import('@/modules/matches').then((m) => m.default)),
    page('/matches-create', () => import('@/modules/matches/create').then((m) => m.default)),
    page('/matches/:id/edit', () => import('@/modules/matches/update').then((m) => m.default)),

    page('/venues', () => import('@/modules/venues').then((m) => m.VenuesModule)),
    page('/venues-create', () => import('@/modules/venues/create').then((m) => m.CreateVenue)),
    page('/venues/:id/edit', () => import('@/modules/venues/update').then((m) => m.UpdateVenue)),

    page('/notifications', () => import('@/modules/notifications').then((m) => m.default), true),
    page('/users', () => import('@/modules/users').then((m) => m.default), true),
    page('/contact', () => import('@/modules/contact/Contact').then((m) => m.default)),
    page('/support', () => import('@/modules/support/Support').then((m) => m.default)),

    page('/reports', () => import('@/modules/reports').then((m) => m.ReportsModule), true),
    page('/reports/season-standings', () => import('@/modules/reports/season-standings').then((m) => m.SeasonStandingsReport), true),
    page('/reports/roster-profile', () => import('@/modules/reports/roster-profile').then((m) => m.RosterProfileReport), true),
    page('/reports/scoring-ranking', () => import('@/modules/reports/scoring-ranking').then((m) => m.ScoringRankingReport), true),
    page('/reports/points-progress', () => import('@/modules/reports/points-progress').then((m) => m.PointsProgressReport), true),
    page('/reports/match-load', () => import('@/modules/reports/match-load').then((m) => m.MatchLoadReport), true),
    page('/reports/staff-ratio', () => import('@/modules/reports/staff-ratio').then((m) => m.StaffRatioReport), true),
    page('/reports/staff-impact', () => import('@/modules/reports/staff-impact').then((m) => m.StaffImpactReport), true),
    page('/reports/season-agenda', () => import('@/modules/reports/season-agenda').then((m) => m.SeasonAgendaReport), true),
    page('/reports/category-participation', () => import('@/modules/reports/category-participation').then((m) => m.CategoryParticipationReport), true),
    page('/reports/schedule-density', () => import('@/modules/reports/schedule-density').then((m) => m.ScheduleDensityReport), true),
    page('/reports/payment-method-performance', () => import('@/modules/reports/payment-method-performance').then((m) => m.PaymentMethodPerformanceReport), true),
    page('/reports/subscription-plan-performance', () => import('@/modules/reports/subscription-plan-performance').then((m) => m.SubscriptionPlanPerformanceReport), true),
  ],
};

function getReturnDestination(state: unknown) {
  const fallback = '/dashboard';
  if (!state || typeof state !== 'object' || !('returnTo' in state)) return fallback;
  const target = state.returnTo;
  if (typeof target !== 'string' || !target.startsWith('/') || target.startsWith('//') || target.includes('\\')) {
    return fallback;
  }

  const url = new URL(target, window.location.origin);
  if (url.origin !== window.location.origin || !matchRoutes([protectedRoute], url.pathname)) {
    return fallback;
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

let router: ReturnType<typeof createBrowserRouter> | undefined;

export default function useRouterApp() {
  router ??= createBrowserRouter([
    protectedRoute,
    {
      path: '/login',
      element: <Login getReturnDestination={getReturnDestination} />,
      errorElement: <ErrorPage />,
    },
    { path: '*', element: <ErrorPage /> },
  ], { basename: import.meta.env.BASE_URL });
  return router;
}
