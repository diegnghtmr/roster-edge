import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { DataTable, type TableColumn } from './DataTable';
import type { FilterConfig } from './SearchComponent';
import { Button } from '../ui/button';

// Example interface for your data
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// Example usage component
export const ExampleTable: React.FC = () => {
  // Mock data
  const users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      createdAt: '2024-01-02',
    },
  ];

  // Define table headers
  const headers: TableColumn[] = [
    { title: 'ID', key: 'id' },
    { title: 'Nombre', key: 'name' },
    { title: 'Email', key: 'email' },
    { title: 'Rol', key: 'role' },
    { title: 'Fecha de creación', key: 'createdAt' },
    { title: 'Acciones', key: 'actions' },
  ];

  // Define filters for search component
  const filters: FilterConfig[] = [
    {
      key: 'name',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Buscar por nombre...',
    },
    {
      key: 'role',
      label: 'Rol',
      type: 'select',
      options: [
        { key: 'admin', value: 'Admin' },
        { key: 'user', value: 'User' },
      ],
      placeholder: 'Seleccionar rol',
    },
    {
      key: 'active',
      label: 'Activo',
      type: 'button',
    },
  ];

  // Render function for each row
  const renderRow = (user: User) => (
    <TableRow key={user.id}>
      <TableCell className="text-start">{user.id}</TableCell>
      <TableCell className="font-semibold text-start">{user.name}</TableCell>
      <TableCell className="text-start">{user.email}</TableCell>
      <TableCell className="text-start">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            user.role === 'Admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {user.role}
        </span>
      </TableCell>
      <TableCell className="text-start">{user.createdAt}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button className="">Editar</Button>
          <Button className="">Eliminar</Button>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lista de Usuarios</h1>

      <DataTable
        data={users}
        headers={headers}
        filters={filters}
        renderRow={renderRow}
        loading={false}
        emptyMessage="No se encontraron usuarios"
      />
    </div>
  );
};
