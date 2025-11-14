import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface INewStaffRole {
  name: string;
}

interface IField {
  name: string;
  value: string | number;
}

interface StaffRoleFormProps {
  staffRole: INewStaffRole;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeValue: (field: IField) => void;
  isLoading: boolean;
}

export const StaffRoleForm: React.FC<StaffRoleFormProps> = ({
  staffRole,
  onSubmit,
  onChangeValue,
  isLoading,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre del rol
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          value={staffRole.name}
          onChange={(e) => onChangeValue({ name: 'name', value: e.target.value })}
          placeholder="Ingrese el nombre del rol"
          required
        />
      </div>

      <div className="flex justify-end col-span-1 md:col-span-2 xl:col-span-3">
        <Button type="submit" disabled={isLoading} className="max-w-[200px]">
          {isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};
