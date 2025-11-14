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
import type { Club } from '@/interface/IClub';

export interface INewSeason {
  clubId: number;
  name: string;
  startDate: number[];
  endDate: number[];
  active: boolean;
}

interface IField {
  name: string;
  value: string | number | boolean | number[];
}

interface SeasonFormProps {
  season: INewSeason;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeValue: (field: IField) => void;
  isLoading: boolean;
}

export const SeasonForm: React.FC<SeasonFormProps> = ({
  season,
  onSubmit,
  onChangeValue,
  isLoading,
}) => {
  // Fetch clubs for the dropdown
  const { data: clubs = [], isLoading: clubsLoading } = useGetList<Club[]>({
    key: 'clubs',
    resource: ['clubs'],
    keyResults: 'data',
    enabled: true,
  });

  // Parse a date string (YYYY-MM-DD) to the array format expected by the API
  const parseDateToArray = (dateString: string): number[] => {
    const date = new Date(dateString);
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  };

  // Format the date array to a string for the date input
  const formatDateArray = (dateArray: number[]): string => {
    if (!dateArray || dateArray.length !== 3) {
      return '';
    }
    const [year, month, day] = dateArray;
    // Ensure month and day are zero-padded
    const paddedMonth = month.toString().padStart(2, '0');
    const paddedDay = day.toString().padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  };

  return (
    <form onSubmit={onSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre de la Temporada
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          value={season.name}
          onChange={(e) => onChangeValue({ name: 'name', value: e.target.value })}
          placeholder="Ej. Temporada 2024-I"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="clubId" className="text-sm font-medium text-gray-700">
          Club
        </label>
        <Select
          value={season.clubId?.toString()}
          onValueChange={(value) => onChangeValue({ name: 'clubId', value: parseInt(value) })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione un club" />
          </SelectTrigger>
          <SelectContent>
            {clubsLoading ? (
              <SelectItem value="loading" disabled>
                Cargando...
              </SelectItem>
            ) : (
              (clubs as Club[]).map((club: Club) => (
                <SelectItem key={club.id} value={club.id.toString()}>
                  {club.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
          Fecha de Inicio
        </label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={formatDateArray(season.startDate)}
          onChange={(e) =>
            onChangeValue({
              name: 'startDate',
              value: parseDateToArray(e.target.value),
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="endDate" className="text-sm font-medium text-gray-700">
          Fecha de Fin
        </label>
        <Input
          id="endDate"
          name="endDate"
          type="date"
          value={formatDateArray(season.endDate)}
          onChange={(e) =>
            onChangeValue({
              name: 'endDate',
              value: parseDateToArray(e.target.value),
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="active" className="text-sm font-medium text-gray-700">
          Estado
        </label>
        <Select
          value={season.active ? 'true' : 'false'}
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
