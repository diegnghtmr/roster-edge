import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import MatchCreateModule from '@/modules/matches/create';
import MatchUpdateModule from '@/modules/matches/update';
import { EventForm, type INewEvent } from '@/modules/events/components/Form';
import { SeasonForm, type INewSeason } from '@/modules/seasons/components/Form';
import { StadiumForm, type INewStadium } from '@/modules/stadiums/components/Form';
import { apiData, mockApi, queryRouter, writeRequests } from './httpFixture';

const event: INewEvent = { seasonId: 1, venueId: 1, name: 'Final', description: 'At the stadium', date: [2026, 12, 8], active: true };
const season: INewSeason = { clubId: 1, name: 'Winter', startDate: [2026, 12, 8], endDate: [2026, 12, 9], active: true };
const stadium: INewStadium = { area: 100, surface: 'Grass', totalCapacity: 1000, foundation: [2026, 12, 8], venueId: 1, active: true };

function EventEditor({ value = event, onSubmit }: { value?: INewEvent; onSubmit: ComponentProps<typeof EventForm>['onSubmit'] }) {
  const [fields, setFields] = useState(value);
  return <EventForm event={fields} isLoading={false} onSubmit={onSubmit} onChangeValue={({ name, value }) => setFields((prev) => ({ ...prev, [name]: value }))} />;
}

function SeasonEditor({ onSubmit }: { onSubmit: ComponentProps<typeof SeasonForm>['onSubmit'] }) {
  const [fields, setFields] = useState(season);
  return <SeasonForm season={fields} isLoading={false} onSubmit={onSubmit} onChangeValue={({ name, value }) => setFields((prev) => ({ ...prev, [name]: value }))} />;
}

function StadiumEditor({ onSubmit }: { onSubmit: ComponentProps<typeof StadiumForm>['onSubmit'] }) {
  const [fields, setFields] = useState(stadium);
  return <StadiumForm stadium={fields} isLoading={false} onSubmit={onSubmit} onChangeValue={({ name, value }) => setFields((prev) => ({ ...prev, [name]: value }))} />;
}

describe('date-only fields', () => {
  it('saves a match on the selected day, reloads it, and saves an edited leap day through the HTTP interface', async () => {
    let saved: Record<string, unknown> = {};
    const fetchMock = mockApi((url, init) => {
      if (init?.method === 'POST' || init?.method === 'PUT') {
        saved = JSON.parse(String(init.body));
        return apiData({ ...saved, id: 6 });
      }
      if (url.pathname === '/api/matches/6/') return apiData({ ...saved, id: 6 });
      if (url.pathname === '/api/match-home-teams/') return apiData([{ teamId: 11 }]);
      if (url.pathname === '/api/match-away-teams/') return apiData([{ teamId: 22 }]);
      if (url.pathname === '/api/teams/') return apiData([{ id: 11, name: 'North' }, { id: 22, name: 'South' }]);
      if (url.pathname === '/api/stadiums/') return apiData([{ id: 3, surface: 'Grass' }]);
      if (url.pathname === '/api/matchdays/') return apiData([{ id: 4, name: 'Day one' }]);
      if (url.pathname === '/api/events/') return apiData([{ id: 5, name: 'Final' }]);
      throw new Error(`Unexpected GET ${url.pathname}`);
    });
    const create = render(<MatchCreateModule />, { wrapper: queryRouter() });
    const date = screen.getByLabelText('Fecha del Partido');
    fireEvent.change(date, { target: { value: '2026-12-08' } });
    expect(date).toHaveValue('2026-12-08');
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(4));
    async function pick(field: string, label: string) {
      const trigger = screen.getByRole('combobox', { name: field });
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      const option = await screen.findByRole('option', { name: label });
      fireEvent.keyDown(option, { key: 'Enter' });
    }
    await pick('Estadio', 'Estadio 3 - Grass');
    await pick('Jornada', 'Day one');
    await pick('Evento', 'Final');
    await pick('Equipo local', 'North');
    await pick('Equipo visitante', 'South');
    const submit = screen.getByRole('button', { name: 'Guardar' });
    fireEvent.change(date, { target: { value: '' } });
    await act(async () => {
      fireEvent.submit(submit.closest('form')!);
    });
    expect(writeRequests(fetchMock)).toEqual([]);
    fireEvent.change(date, { target: { value: '2026-12-08' } });
    fireEvent.click(submit);
    const expected = { matchdayId: 4, startTime: [0, 0], endTime: [0, 0], date: [2026, 12, 8], stadiumId: 3, eventId: 5, homeTeamId: 11, awayTeamId: 22, active: true };
    await waitFor(() => expect(writeRequests(fetchMock)).toEqual([{ path: '/api/matches/', method: 'POST', body: expected }]));
    create.unmount();

    render(
      <Routes>
        <Route path="/matches/:id/edit" element={<MatchUpdateModule />} />
        <Route path="*" element={<p>Left editor</p>} />
      </Routes>,
      { wrapper: queryRouter('/matches/6/edit') }
    );
    const editDate = await screen.findByLabelText('Fecha del Partido');
    await waitFor(() => expect(editDate).toHaveValue('2026-12-08'));
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: 'Equipo local' })).toHaveTextContent('North');
      expect(screen.getByRole('combobox', { name: 'Equipo visitante' })).toHaveTextContent('South');
    });
    fireEvent.change(editDate, { target: { value: '2028-02-29' } });
    expect(editDate).toHaveValue('2028-02-29');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    await waitFor(() => expect(writeRequests(fetchMock)).toEqual([
      { path: '/api/matches/', method: 'POST', body: expected },
      { path: '/api/matches/6/', method: 'PUT', body: { ...expected, date: [2028, 2, 29] } },
    ]));
  });

  it.each([
    ['Fecha del Evento', EventEditor],
    ['Fecha de Inicio', SeasonEditor],
    ['Fecha de Fin', SeasonEditor],
    ['Fecha de Fundación', StadiumEditor],
  ] as const)('keeps the chosen leap day and rejects an empty %s', (label, Editor) => {
    mockApi(() => apiData([]));
    const onSubmit = vi.fn<ComponentProps<typeof EventForm>['onSubmit']>((event) => event.preventDefault());
    render(<Editor onSubmit={onSubmit} />, { wrapper: queryRouter() });
    const input = screen.getByLabelText(label);
    fireEvent.change(input, { target: { value: '2028-02-29' } });
    expect(input).toHaveValue('2028-02-29');
    const submit = screen.getByRole('button', { name: 'Guardar' });
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    fireEvent.change(input, { target: { value: '' } });
    expect(input).toHaveValue('');
    expect(input).toBeInvalid();
    fireEvent.submit(submit.closest('form')!);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('does not show an invalid calendar date returned by the API', () => {
    mockApi(() => apiData([]));
    render(<EventEditor value={{ ...event, date: [2027, 2, 29] }} onSubmit={vi.fn()} />, { wrapper: queryRouter() });
    expect(screen.getByLabelText('Fecha del Evento')).toHaveValue('');
  });
});
