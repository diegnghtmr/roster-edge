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
import type { City } from '@/interface/ICity';
import type { Club } from '@/interface/IClub';

export interface INewVenue {
  name: string;
  email: string;
  cityId: number;
  foundation: string;
  phone: string;
  clubId: number;
  active: boolean;
}

interface IField {
  name: string;
  value: string | number | boolean;
}

interface VenueFormProps {
  venue: INewVenue;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeValue: (field: IField) => void;
  isLoading: boolean;
  cities?: City[];
  clubs?: Club[];
}

export const VenueForm: React.FC<VenueFormProps> = ({
  venue,
  onSubmit,
  onChangeValue,
  isLoading,
  cities = [],
  clubs = [],
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre de la sede
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          value={venue.name}
          onChange={(e) => onChangeValue({ name: 'name', value: e.target.value })}
          placeholder="Ingrese el nombre de la sede"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={venue.email}
          onChange={(e) => onChangeValue({ name: 'email', value: e.target.value })}
          placeholder="Ingrese el email de la sede"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Teléfono
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={venue.phone}
          onChange={(e) => onChangeValue({ name: 'phone', value: e.target.value })}
          placeholder="Ingrese el teléfono de la sede"
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
          value={venue.foundation}
          onChange={(e) => onChangeValue({ name: 'foundation', value: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="cityId" className="text-sm font-medium text-gray-700">
          Ciudad
        </label>
        <Select
          value={venue.cityId?.toString()}
          onValueChange={(value) => onChangeValue({ name: 'cityId', value: parseInt(value) })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione una ciudad" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="clubId" className="text-sm font-medium text-gray-700">
          Club
        </label>
        <Select
          value={venue.clubId?.toString()}
          onValueChange={(value) => onChangeValue({ name: 'clubId', value: parseInt(value) })}
        >
          <SelectTrigger className="w-full">
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

      <div className="space-y-2">
        <label htmlFor="active" className="text-sm font-medium text-gray-700">
          Estado
        </label>
        <Select
          value={venue.active ? 'true' : 'false'}
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

      <div className="flex justify-end col-span-1 md:col-span-2 xl:col-span-3">
        <Button type="submit" disabled={isLoading} className="max-w-[200px]">
          {isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};
