import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface INewCountry {
  name: string;
}

interface IField {
  name: string;
  value: string | number;
}

interface CountryFormProps {
  country: INewCountry;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeValue: (field: IField) => void;
  isLoading: boolean;
}

export const CountryForm: React.FC<CountryFormProps> = ({
  country,
  onSubmit,
  onChangeValue,
  isLoading,
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre del país
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          value={country.name}
          onChange={(e) => onChangeValue({ name: 'name', value: e.target.value })}
          placeholder="Ingrese el nombre del país"
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="max-w-[200px]">
          {isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};
