import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import TeamCreateModule from '@/modules/teams/create';
import TeamUpdateModule from '@/modules/teams/update';
import { apiData, mockApi, queryRouter, writeRequests } from './httpFixture';

const club = { id: 5, name: 'North Club' };
const category = { id: 9, name: 'Senior' };
const team = { id: 6, name: 'North XI', mascot: 'Owl', foundation: [2024, 2, 29], genderId: 87, categoryId: 9, clubId: 5 };
const genders = [{ id: 21, name: 'Open' }, { id: 87, name: 'Women and girls' }];

function teamApi(genderCatalog: typeof genders, existing = team) {
  return mockApi((url, init) => {
    if (init?.method !== 'GET') return apiData(existing);
    switch (url.pathname) {
      case '/api/team-genders/': return apiData(genderCatalog);
      case '/api/team-categories/': return apiData([category]);
      case '/api/clubs/': return apiData([club]);
      case '/api/teams/6/': return apiData(existing);
      default: throw new Error(`Unexpected GET ${url.pathname}`);
    }
  });
}

function editTeam() {
  return render(
    <Routes>
      <Route path="/teams/:id/edit" element={<TeamUpdateModule />} />
      <Route path="*" element={<p>Left editor</p>} />
    </Routes>,
    { wrapper: queryRouter('/teams/6/edit') }
  );
}

describe('team gender catalog', () => {
  it('loads the catalog when creating a team instead of showing fixture labels', async () => {
    const fetchMock = teamApi(genders);
    render(<TeamCreateModule />, { wrapper: queryRouter() });
    await screen.findByRole('button', { name: 'Guardar' });
    await waitFor(() => expect(fetchMock.mock.calls.some(([url]) => new URL(String(url)).pathname === '/api/team-genders/')).toBe(true));
    const trigger = screen.getByRole('combobox', { name: 'Género' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(await screen.findByRole('option', { name: 'Open' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Women and girls' })).toBeVisible();
    expect(screen.queryByRole('option', { name: /^MALE$/ })).not.toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('option', { name: 'Open' }), { key: 'Enter' });
    expect(trigger).toHaveTextContent('Open');

    for (const [label, option] of [['Categoría', 'Senior'], ['Club', 'North Club']]) {
      fireEvent.keyDown(screen.getByRole('combobox', { name: label }), { key: 'ArrowDown' });
      fireEvent.keyDown(await screen.findByRole('option', { name: option }), { key: 'Enter' });
    }
    fireEvent.change(screen.getByLabelText('Nombre del equipo'), { target: { value: 'South XI' } });
    fireEvent.change(screen.getByLabelText('Mascota'), { target: { value: 'Fox' } });
    fireEvent.change(screen.getByLabelText('Fecha de fundación'), { target: { value: '2024-02-29' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    await waitFor(() => expect(writeRequests(fetchMock)).toEqual([{
      path: '/api/teams/', method: 'POST',
      body: { name: 'South XI', mascot: 'Fox', foundation: '2024-02-29', genderId: 21, categoryId: 9, clubId: 5 },
    }]));
  });

  it('uses the catalog name for an existing non-sequential ID and preserves that ID on save', async () => {
    const fetchMock = teamApi(genders);
    editTeam();
    const submit = await screen.findByRole('button', { name: 'Guardar' });
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Género' })).toHaveTextContent('Women and girls'));
    expect(screen.getByLabelText('Fecha de fundación')).toHaveValue('2024-02-29');
    fireEvent.click(submit);
    await waitFor(() => expect(writeRequests(fetchMock)).toEqual([{
      path: '/api/teams/6/', method: 'PUT',
      body: { name: 'North XI', mascot: 'Owl', foundation: '2024-02-29', genderId: 87, categoryId: 9, clubId: 5 },
    }]));
  });

  it.each([
    { catalog: [], message: 'No hay géneros disponibles' },
    { catalog: [{ id: 21, name: 'Open' }], message: 'Seleccione un género' },
  ])('does not write a team when its selected ID is missing: $message', async ({ catalog, message }) => {
    const fetchMock = teamApi(catalog);
    editTeam();
    const submit = await screen.findByRole('button', { name: 'Guardar' });
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Género' })).toHaveTextContent(message));
    expect(submit).toBeDisabled();
    await act(async () => {
      fireEvent.submit(submit.closest('form')!);
    });
    expect(writeRequests(fetchMock)).toEqual([]);
    expect(screen.getByLabelText('Nombre del equipo')).toHaveValue('North XI');
  });
});
