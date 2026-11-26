import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { useSeasonStandingsReport } from '@/api/services/reports/useReportsData';
import { MatchesList } from '@/modules/matches/components/List';
import useUserStore from '@/storage/storeUser';
import { apiData, mockApi, queryRouter, writeRequests } from './httpFixture';

const fixture = {
  id: 17,
  date: [2026, 10, 20],
  active: true,
  homeTeamId: 12,
  homeTeamName: 'Mirador FC',
  awayTeamId: 34,
  awayTeamName: 'Bambú City FC',
};
const resultPath = '/api/matches/17/result/';

function setup(putResult: () => Response) {
  let scores: [number, number] | null = null;
  const api = mockApi((url, init) => {
    if (url.pathname === '/api/matches/schedule/') {
      return apiData([{
        ...fixture,
        homeScore: scores?.[0],
        awayScore: scores?.[1],
        resultLabel: scores?.join('-'),
      }]);
    }
    if (url.pathname === '/api/analytics/reports/season-standings/') {
      return apiData(scores ? [{ played: 1, goalsFor: scores[0] }] : []);
    }
    if (url.pathname === resultPath && init?.method === 'PUT') {
      expect(new Headers(init.headers).get('Authorization')).toBe('Bearer sample-session');
      const response = putResult();
      if (response.ok) {
        const { homeScore, awayScore } = JSON.parse(String(init.body));
        scores = [homeScore, awayScore];
      }
      return response;
    }
    throw new Error(`Unexpected request: ${init?.method} ${url.pathname}`);
  });
  return api;
}

function StandingsSummary() {
  const { data } = useSeasonStandingsReport();
  return <output aria-label="Goles en la tabla">{data?.[0]?.goalsFor ?? 0}</output>;
}

function Location() {
  const { pathname, search } = useLocation();
  return <output aria-label="Ubicación">{pathname}{search}</output>;
}

async function openForm() {
  const person = userEvent.setup();
  await person.click(await screen.findByRole('button', { name: 'Registrar resultado' }));
  const dialog = within(screen.getByRole('dialog', { name: 'Registrar resultado' }));
  const home = dialog.getByRole('spinbutton', { name: 'Goles local' });
  const away = dialog.getByRole('spinbutton', { name: 'Goles visitante' });
  expect(dialog.getByText('Mirador FC')).toBeVisible();
  expect(dialog.getByText('Bambú City FC')).toBeVisible();
  expect(home).toHaveValue(null);
  expect(away).toHaveValue(null);
  await person.type(home, '2');
  await person.type(away, '0');
  return { person, dialog, home, away, submit: dialog.getByRole('button', { name: 'Guardar resultado' }) };
}

beforeEach(() => {
  useUserStore.getState().setUser({
    id: 5, clubId: 3, subscriptionId: 1, name: 'Club demo', email: 'club@example.invalid',
  }, 'sample-session');
});

afterEach(() => {
  cleanup();
  useUserStore.getState().clearUser();
});

it('finalizes an explicit zero with one PUT and refreshes the schedule and standings', async () => {
  const api = setup(() => apiData({ homeScore: 2, awayScore: 0 }));
  render(<><MatchesList /><StandingsSummary /></>, { wrapper: queryRouter('/matches') });
  const { person, submit } = await openForm();
  await person.click(submit);

  expect(await screen.findByRole('cell', { name: '2-0' })).toBeVisible();
  await waitFor(() => expect(screen.getByLabelText('Goles en la tabla')).toHaveTextContent('2'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(writeRequests(api)).toEqual([{ path: resultPath, method: 'PUT', body: { homeScore: 2, awayScore: 0 } }]);

  // The existing edit action remains available, and corrections start from the saved score.
  expect(screen.getByRole('link', { name: 'Editar' })).toHaveAttribute('href', '/matches/17/edit');
  await person.click(screen.getByRole('button', { name: 'Editar resultado' }));
  const dialog = within(screen.getByRole('dialog', { name: 'Editar resultado' }));
  expect(dialog.getByRole('spinbutton', { name: 'Goles local' })).toHaveValue(2);
  expect(dialog.getByRole('spinbutton', { name: 'Goles visitante' })).toHaveValue(0);
  const home = dialog.getByRole('spinbutton', { name: 'Goles local' });
  await person.clear(home);
  await person.type(home, '3');
  await person.click(dialog.getByRole('button', { name: 'Guardar resultado' }));
  expect(await screen.findByRole('cell', { name: '3-0' })).toBeVisible();
  await waitFor(() => expect(screen.getByLabelText('Goles en la tabla')).toHaveTextContent('3'));
  expect(writeRequests(api).at(-1)).toEqual({ path: resultPath, method: 'PUT', body: { homeScore: 3, awayScore: 0 } });
});

it('does not submit missing, negative, fractional or out-of-range scores', async () => {
  const api = setup(() => apiData({}));
  render(<MatchesList />, { wrapper: queryRouter('/matches') });
  const { person, dialog, home, submit } = await openForm();
  await person.clear(home);
  expect(submit).toBeDisabled();
  for (const invalid of ['-1', '1.5', '2147483648']) {
    await person.type(home, invalid);
    expect(submit).toBeDisabled();
    fireEvent.submit(submit.closest('form')!);
    await person.clear(home);
  }
  expect(writeRequests(api)).toEqual([]);
  await person.click(dialog.getByRole('button', { name: 'Cancelar' }));
  expect(screen.getByRole('cell', { name: 'Sin resultado' })).toBeVisible();
});

it('shows the validation details from the API without changing the result', async () => {
  const api = setup(() => Response.json({
    success: false,
    message: 'Validation failed',
    data: { homeScore: 'must be greater than or equal to 0' },
    errorCode: 'VALIDATION_ERROR',
  }, { status: 400 }));
  render(<MatchesList />, { wrapper: queryRouter('/matches') });
  const { person, dialog, home, submit } = await openForm();
  await person.click(submit);

  expect(await dialog.findByRole('alert')).toHaveTextContent('Datos de entrada inválidos.');
  expect(home).toHaveAccessibleDescription('must be greater than or equal to 0');
  expect(home).toHaveValue(2);
  expect(submit).toBeEnabled();
  expect(writeRequests(api)).toHaveLength(1);
  await person.click(dialog.getByRole('button', { name: 'Cancelar' }));
  expect(screen.getByRole('cell', { name: 'Sin resultado' })).toBeVisible();
});

it.each([
  [403, 'No tienes permisos para realizar esta acción.'],
  [409, 'Conflicto: El recurso ya existe.'],
])('handles HTTP %s without changing the result or discarding the entered score', async (status, message) => {
  const api = setup(() => new Response(null, { status }));
  render(<MatchesList />, { wrapper: queryRouter('/matches') });
  const { person, dialog, home, away, submit } = await openForm();
  await person.click(submit);

  expect(await dialog.findByRole('alert')).toHaveTextContent(message);
  expect(home).toHaveValue(2);
  expect(away).toHaveValue(0);
  expect(submit).toBeEnabled();
  expect(writeRequests(api)).toHaveLength(1);
  await person.click(dialog.getByRole('button', { name: 'Cancelar' }));
  expect(screen.getByRole('cell', { name: 'Sin resultado' })).toBeVisible();
});

it('clears an expired session and returns to sign-in without changing the result', async () => {
  const api = setup(() => new Response(null, { status: 401 }));
  render(<><MatchesList /><Location /></>, { wrapper: queryRouter('/matches') });
  const { person, submit } = await openForm();
  await person.click(submit);

  await waitFor(() => expect(screen.getByLabelText('Ubicación')).toHaveTextContent('/login?error=session'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Registrar resultado' })).not.toBeInTheDocument();
  expect(localStorage.getItem('token')).toBeNull();
  expect(localStorage.getItem('roster-profile')).toBeNull();
  expect(writeRequests(api)).toHaveLength(1);
});

it('offers no result action or form without an authorized roster session', async () => {
  const api = setup(() => apiData({}));
  useUserStore.getState().clearUser();
  render(<MatchesList />, { wrapper: queryRouter('/matches') });

  expect(await screen.findByRole('cell', { name: 'Mirador FC' })).toBeVisible();
  expect(screen.queryByRole('button', { name: /resultado/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(writeRequests(api)).toEqual([]);
});

it('blocks repeated form submissions before and during the request', async () => {
  const api = setup(() => apiData({ homeScore: 2, awayScore: 0 }));
  const respond = api.getMockImplementation()!;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  api.mockImplementation(async (input, init) => {
    if (init?.method === 'PUT') await gate;
    return respond(input, init);
  });
  render(<MatchesList />, { wrapper: queryRouter('/matches') });
  const { dialog, submit } = await openForm();
  const form = submit.closest('form')!;
  act(() => {
    fireEvent.submit(form);
    fireEvent.submit(form);
  });
  expect(dialog.getByRole('button', { name: 'Guardando...' })).toBeDisabled();
  fireEvent.submit(form);
  expect(writeRequests(api)).toHaveLength(1);

  release();
  expect(await screen.findByRole('cell', { name: '2-0' })).toBeVisible();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(writeRequests(api)).toHaveLength(1);
});
