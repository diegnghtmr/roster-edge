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
import useGetList from '@/api/services/getServices/useGetList';
import type { IVenueResponse } from '@/interface/IVenue';

export interface INewStadium {
  area: number;
  surface: string;
  totalCapacity: number;
  foundation: number[];
  venueId: number;
  active: boolean;
}

interface IField {
  name: string;
  value: string | number | boolean | number[];
}

interface StadiumFormProps {
  stadium: INewStadium;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeValue: (field: IField) => void;
  isLoading: boolean;
}

export const StadiumForm: React.FC<StadiumFormProps> = ({
  stadium,
  onSubmit,
  onChangeValue,
  isLoading,
}) => {
  // Fetch venues for the dropdown
  const { data: venues = [], isLoading: venuesLoading } = useGetList({
    key: 'venues',
    resource: ['venues'],
    keyResults: 'data',
    enabled: true,
  });

  // Parse a date string (YYYY-MM-DD) to the array format expected by the API
  const parseDateToArray = (dateString: string): number[] => {
    const date = new Date(dateString);
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  };

  // Format the foundation date array to a string for the date input
  const formatFoundationDate = (): string => {
    if (!stadium.foundation || stadium.foundation.length !== 3) {
      return '';
    }
    const [year, month, day] = stadium.foundation;
    // Ensure month and day are zero-padded
    const paddedMonth = month.toString().padStart(2, '0');
    const paddedDay = day.toString().padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  };

  return (
    <form onSubmit={onSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="area" className="text-sm font-medium text-gray-700">
          Área (m²)
        </label>
        <Input
          id="area"
          name="area"
          type="number"
          step="0.01"
          value={stadium.area}
          onChange={(e) => onChangeValue({ name: 'area', value: parseFloat(e.target.value) })}
          placeholder="Ingrese el área del estadio"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="surface" className="text-sm font-medium text-gray-700">
          Superficie
        </label>
        <Input
          id="surface"
          name="surface"
          type="text"
          value={stadium.surface}
          onChange={(e) => onChangeValue({ name: 'surface', value: e.target.value })}
          placeholder="Tipo de superficie (ej. césped natural)"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="totalCapacity" className="text-sm font-medium text-gray-700">
          Capacidad Total
        </label>
        <Input
          id="totalCapacity"
          name="totalCapacity"
          type="number"
          value={stadium.totalCapacity}
          onChange={(e) =>
            onChangeValue({
              name: 'totalCapacity',
              value: parseInt(e.target.value),
            })
          }
          placeholder="Capacidad total del estadio"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="foundation" className="text-sm font-medium text-gray-700">
          Fecha de Fundación
        </label>
        <Input
          id="foundation"
          name="foundation"
          type="date"
          value={formatFoundationDate()}
          onChange={(e) =>
            onChangeValue({
              name: 'foundation',
              value: parseDateToArray(e.target.value),
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="venueId" className="text-sm font-medium text-gray-700">
          Sede
        </label>
        <Select
          value={stadium.venueId?.toString()}
          onValueChange={(value) => onChangeValue({ name: 'venueId', value: parseInt(value) })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione una sede" />
          </SelectTrigger>
          <SelectContent>
            {venuesLoading ? (
              <SelectItem value="loading" disabled>
                Cargando...
              </SelectItem>
            ) : (
              venues.map((venue: IVenueResponse) => (
                <SelectItem key={venue.id} value={venue.id.toString()}>
                  {venue.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="active" className="text-sm font-medium text-gray-700">
          Estado
        </label>
        <Select
          value={stadium.active ? 'true' : 'false'}
          onValueChange={(value) => onChangeValue({ name: 'active', value: value === 'true' })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione el estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Activo</SelectItem>
            <SelectItem value="false">Inactivo</SelectItem>
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
