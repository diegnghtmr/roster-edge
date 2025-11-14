import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface INewCity {
  name: string;
  countryId: number;
}

interface ICountry {
  id: number;
  name: string;
}

interface IField {
  name: string;
  value: string | number;
}

interface CityFormProps {
  city: INewCity;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeValue: (field: IField) => void;
  isLoading: boolean;
  countries?: ICountry[];
}

export const CityForm: React.FC<CityFormProps> = ({
  city,
  onSubmit,
  onChangeValue,
  isLoading,
  countries = [
    { id: 1, name: 'Colombia' },
    { id: 2, name: 'Argentina' },
    { id: 3, name: 'España' },
  ], // Default list of countries
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre de la ciudad
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          value={city.name}
          onChange={(e) => onChangeValue({ name: 'name', value: e.target.value })}
          placeholder="Ingrese el nombre de la ciudad"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="countryId" className="text-sm font-medium text-gray-700">
          País
        </label>
        <Select
          value={city.countryId?.toString()}
          onValueChange={(value) => onChangeValue({ name: 'countryId', value: parseInt(value) })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione un país" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.id.toString()}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end col-span-1 md:col-span-2">
        <Button type="submit" disabled={isLoading} className="max-w-[200px]">
          {isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};
