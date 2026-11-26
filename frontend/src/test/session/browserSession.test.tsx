import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CookiesProvider } from 'react-cookie';
import { RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/modules/dashboard/Dashboard', () => ({ default: () => <h1>Dashboard</h1> }));
vi.mock('@/modules/reports/season-standings', () => ({
  SeasonStandingsReport: () => <h1>Season standings</h1>,
}));
vi.mock('@/components/sidebar/Sidebar', () => ({ default: () => null }));
vi.mock('@/shared/hooks', () => ({}));
vi.mock('@/shared/components', () => ({}));

const api = 'https://api.example.invalid/api';
const token = 'test-session';
const originalProfile = {
  id: 12,
  name: 'Sample Coach',
  email: 'coach@example.invalid',
  clubId: 34,
  subscriptionId: 56,
};

function fakeSession({ profileStatus = 200, logoutFails = false } = {}) {
  let profile = originalProfile;
  let active = true;
  const request = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    const authenticated = new Headers(init?.headers).get('Authorization') === `Bearer ${token}`;
    if (url === `${api}/roster/login/` && method === 'POST') {
      active = true;
      return Response.json({ data: { token } });
    }
    if (url === `${api}/roster/me/` && method === 'GET' && authenticated) {
      return active && profileStatus === 200
        ? Response.json({ data: profile })
        : new Response(null, { status: active ? profileStatus : 401 });
    }
    if (url === `${api}/rosters/${profile.id}/` && method === 'PUT' && authenticated && active) {
      const body = JSON.parse(String(init?.body));
      expect(body).toEqual({
        name: 'Renamed Coach',
        email: profile.email,
        clubId: profile.clubId,
        subscriptionId: profile.subscriptionId,
      });
      profile = { ...profile, name: body.name };
      return Response.json({ data: profile });
    }
    if (url === `${api}/roster/logout/` && method === 'POST' && authenticated) {
      if (logoutFails) throw new TypeError('Failed to fetch');
      active = false;
      return new Response(null, { status: 204 });
    }
    throw new Error(`Unexpected request: ${method} ${url}`);
  });
  vi.stubGlobal('fetch', request);
  return request;
}

let disposeRouter: (() => void) | undefined;

async function openRoute(path: string, state: unknown = null) {
  cleanup();
  disposeRouter?.();
  vi.resetModules();
  window.history.replaceState(state, '', path);
  const { default: createRouter } = await import('@/router');
  const router = createRouter();
  disposeRouter = () => router.dispose();
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </CookiesProvider>
  );
  return router;
}

async function signIn() {
  const person = userEvent.setup();
  await person.type(await screen.findByLabelText('Correo electronico'), originalProfile.email);
  await person.type(screen.getByLabelText('Contraseña'), 'example-password');
  await person.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
  return person;
}

beforeEach(() => {
  const entries: Record<string, string> = {};
  vi.stubGlobal('localStorage', Object.defineProperties(entries, {
    getItem: { value: (key: string) => entries[key] ?? null },
    setItem: { value: (key: string, value: string) => { entries[key] = value; } },
    removeItem: { value: (key: string) => { delete entries[key]; } },
  }));
  vi.stubEnv('VITE_BACKEND_URL', api);
  vi.stubEnv('VITE_SECURE_LOCAL_STORAGE_PASSWORD', undefined);
  vi.stubEnv('VITE_SECURE_LOCAL_STORAGE_SALT', undefined);
});

afterEach(() => {
  cleanup();
  disposeRouter?.();
  disposeRouter = undefined;
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('browser sessions', () => {
  it('returns to a protected deep link, including its query and fragment, after login', async () => {
    fakeSession();
    const router = await openRoute('/reports/season-standings?season=8#table');
    await signIn();
    expect(await screen.findByRole('heading', { name: 'Season standings' })).toBeVisible();
    expect(router.state.location).toMatchObject({
      pathname: '/reports/season-standings',
      search: '?season=8',
      hash: '#table',
    });
    expect(window.localStorage.getItem('token')).toBe(token);
  });

  it('still shows the 404 page for an unknown signed-out URL', async () => {
    const request = fakeSession();
    const router = await openRoute('/unknown-report');
    expect(await screen.findByRole('heading', { name: 'Página no encontrada' })).toBeVisible();
    expect(router.state.location.pathname).toBe('/unknown-report');
    expect(request).not.toHaveBeenCalled();
  });

  it('signs in with only the backend URL and rejects a non-app return destination', async () => {
    fakeSession();
    const router = await openRoute('/login', { usr: { returnTo: 'https://example.invalid/' } });
    await signIn();
    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeVisible();
    expect(router.state.location.pathname).toBe('/dashboard');
    expect(window.localStorage.getItem('user')).toBeNull();
    expect(JSON.parse(window.localStorage.getItem('roster-profile') ?? 'null')).toEqual({
      version: 1,
      profile: originalProfile,
    });
  });

  it('does not retain a token if the profile lookup during login fails', async () => {
    fakeSession({ profileStatus: 401 });
    const router = await openRoute('/login');
    await signIn();
    expect(await screen.findByText('Failed to fetch user profile')).toBeVisible();
    expect(router.state.location.pathname).toBe('/login');
    expect(window.localStorage.getItem('token')).toBeNull();
  });

  it('recovers from a corrupt legacy cache and a rejected session', async () => {
    fakeSession({ profileStatus: 401 });
    window.localStorage.setItem('user', 'invalid cached profile');
    window.localStorage.setItem('token', token);
    const router = await openRoute('/dashboard');
    expect(await screen.findByLabelText('Correo electronico')).toBeVisible();
    expect(router.state.location.pathname).toBe('/login');
    expect(window.localStorage.getItem('user')).toBeNull();
    expect(window.localStorage.getItem('token')).toBeNull();
  });

  it('discards an invalid versioned cache before navigating to clean sign-in', async () => {
    const request = fakeSession();
    window.localStorage.setItem('roster-profile', JSON.stringify({ version: 1, profile: [] }));
    window.localStorage.setItem('token', token);
    const router = await openRoute('/dashboard');
    expect(await screen.findByLabelText('Correo electronico')).toBeVisible();
    expect(router.state.location.pathname).toBe('/login');
    expect(window.localStorage.getItem('roster-profile')).toBeNull();
    expect(window.localStorage.getItem('token')).toBeNull();
    expect(request).not.toHaveBeenCalled();
  });

  it('resolves the topbar logo against the application base after a direct nested load', async () => {
    fakeSession();
    window.localStorage.setItem('token', token);
    await openRoute('/reports/season-standings');
    const logo = await screen.findByRole('img', { name: 'roster' });
    expect(new URL(logo.getAttribute('src') ?? '', document.baseURI).pathname).toBe(
      `${import.meta.env.BASE_URL}roster-logo.webp`
    );
  });

  it('saves a profile edit on the configured API and rehydrates it on reload', async () => {
    const request = fakeSession();
    window.localStorage.setItem('token', token);
    await openRoute('/dashboard');
    const person = userEvent.setup();
    await person.click(await screen.findByText('Sa'));
    await person.click(await screen.findByRole('button', { name: 'Ver perfil' }));
    const name = await screen.findByRole('textbox', { name: /Nombre/ });
    expect(name).toHaveValue('Sample Coach');
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeDisabled();
    await person.clear(name);
    await person.type(name, 'Renamed Coach');
    await person.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    expect(await screen.findByText('Re')).toBeVisible();
    expect(window.localStorage.getItem('user')).toBeNull();
    expect(JSON.parse(window.localStorage.getItem('roster-profile') ?? 'null')).toEqual({
      version: 1,
      profile: { ...originalProfile, name: 'Renamed Coach' },
    });
    expect(request.mock.calls.map(([url]) => url)).toEqual([
      `${api}/roster/me/`,
      `${api}/rosters/${originalProfile.id}/`,
    ]);

    await openRoute('/dashboard');
    expect(await screen.findByText('Re')).toBeVisible();
    expect(request).toHaveBeenLastCalledWith(`${api}/roster/me/`, expect.anything());
  });

  it.each([false, true])('clears only this session even when logout fails (%s)', async (logoutFails) => {
    const request = fakeSession({ logoutFails });
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('other-user-setting', 'keep');
    const router = await openRoute('/dashboard');
    const person = userEvent.setup();
    await person.click(await screen.findByText('Sa'));
    await person.click(await screen.findByRole('button', { name: 'Cerrar Sesión' }));
    expect(await screen.findByLabelText('Correo electronico')).toBeVisible();
    expect(router.state.location.pathname).toBe('/login');
    expect(window.localStorage.getItem('token')).toBeNull();
    expect(window.localStorage.getItem('roster-profile')).toBeNull();
    expect(window.localStorage.getItem('other-user-setting')).toBe('keep');
    await waitFor(() => expect(request).toHaveBeenLastCalledWith(
      `${api}/roster/logout/`,
      expect.objectContaining({ method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    ));
    if (!logoutFails) {
      const response = await fetch(`${api}/roster/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).toBe(401);
    }
  });
});
