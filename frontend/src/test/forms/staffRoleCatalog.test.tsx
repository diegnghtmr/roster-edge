import { render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import { StaffRolesModule } from '@/modules/staff-roles';
import { apiData, mockApi, queryRouter } from './httpFixture';

it('renders the staff-role catalog and offers no writes the API denies', async () => {
  const requests = mockApi(() => apiData([{ id: 7, name: 'Entrenador', active: true }]));
  render(<StaffRolesModule />, { wrapper: queryRouter('/staff-roles?name=Entrenador') });

  const row = await screen.findByRole('row', { name: /Entrenador/ });
  expect(row).toBeVisible();
  expect(screen.getByRole('link', { name: 'Personal' })).toHaveAttribute('href', '/staff');
  expect(screen.queryByRole('link', { name: 'Nuevo Rol' })).not.toBeInTheDocument();
  expect(screen.queryByRole('columnheader', { name: 'Acciones' })).not.toBeInTheDocument();
  expect(within(row).queryByText('Editar')).not.toBeInTheDocument();
  expect(within(row).queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument();
  expect(requests.mock.calls.map(([url, init]) => [new URL(String(url)).pathname, new URL(String(url)).search, init?.method ?? 'GET']))
    .toEqual([['/api/staff-roles/', '?name=Entrenador', 'GET']]);
});
