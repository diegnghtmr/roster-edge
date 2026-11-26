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
import type { TeamCategory } from '@/interface/ITeamCategory';
import type { Club } from '@/interface/IClub';
import { useTeamGenderCatalog } from '@/api/services/filters/useFilterOptions';

export interface INewTeam {
  name: string;
  mascot: string;
  foundation: string;
  genderId: number;
  categoryId: number;
  clubId: number;
}

interface IField {
  name: string;
  value: string | number;
}

interface TeamFormProps {
  team: INewTeam;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeValue: (field: IField) => void;
  isLoading: boolean;
  categories?: TeamCategory[];
  clubs?: Club[];
}

export const TeamForm: React.FC<TeamFormProps> = ({
  team,
  onSubmit,
  onChangeValue,
  isLoading,
  categories = [],
  clubs = [],
}) => {
  const { entries: genders, isLoading: gendersLoading, error: gendersError } = useTeamGenderCatalog();
  const selectedGender = genders.find(({ id }) => id === team.genderId);
  const genderPlaceholder = gendersLoading
    ? 'Cargando...'
    : gendersError && !genders.length
      ? 'No se pudieron cargar los géneros'
      : genders.length
        ? 'Seleccione un género'
        : 'No hay géneros disponibles';

  return (
    <form
      onSubmit={(event) => {
        if (selectedGender && !isLoading) onSubmit(event);
        else event.preventDefault();
      }}
      className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre del equipo
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          value={team.name}
          onChange={(e) => onChangeValue({ name: 'name', value: e.target.value })}
          placeholder="Ingrese el nombre del equipo"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="mascot" className="text-sm font-medium text-gray-700">
          Mascota
        </label>
        <Input
          id="mascot"
          name="mascot"
          type="text"
          value={team.mascot}
          onChange={(e) => onChangeValue({ name: 'mascot', value: e.target.value })}
          placeholder="Ingrese la mascota del equipo"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="foundation" className="text-sm font-medium text-gray-700">
          Fecha de fundación
        </label>
        <Input
          id="foundation"
          name="foundation"
          type="date"
          value={team.foundation}
          onChange={(e) => onChangeValue({ name: 'foundation', value: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="genderId" className="text-sm font-medium text-gray-700">
          Género
        </label>
        <Select
          value={selectedGender ? String(selectedGender.id) : ''}
          disabled={gendersLoading || !genders.length}
          onValueChange={(value) => {
            const option = genders.find(({ id }) => String(id) === value);
            if (option) onChangeValue({ name: 'genderId', value: option.id });
          }}
        >
          <SelectTrigger id="genderId" className="w-full">
            <SelectValue placeholder={genderPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {genders.map((gender) => (
              <SelectItem key={gender.id} value={gender.id.toString()}>
                {gender.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="categoryId" className="text-sm font-medium text-gray-700">
          Categoría
        </label>
        <Select
          value={team.categoryId ? String(team.categoryId) : ''}
          onValueChange={(value) => {
            if (value) onChangeValue({ name: 'categoryId', value: Number(value) });
          }}
        >
          <SelectTrigger id="categoryId" className="w-full">
            <SelectValue placeholder="Seleccione una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(({ id, name }) =>
              id == null ? null : (
                <SelectItem key={id} value={String(id)}>
                  {name}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="clubId" className="text-sm font-medium text-gray-700">
          Club
        </label>
        <Select
          value={team.clubId ? String(team.clubId) : ''}
          onValueChange={(value) => {
            if (value) onChangeValue({ name: 'clubId', value: Number(value) });
          }}
        >
          <SelectTrigger id="clubId" className="w-full">
            <SelectValue placeholder="Seleccione un club" />
          </SelectTrigger>
          <SelectContent>
            {clubs.map((club) => (
              <SelectItem key={club.id} value={club.id.toString()}>
                {club.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end col-span-1 md:col-span-2 xl:col-span-3">
        <Button type="submit" disabled={isLoading || !selectedGender} className="max-w-[200px]">
          {isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};
