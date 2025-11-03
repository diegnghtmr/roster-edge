import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetList from "@/api/services/getServices/useGetList";
import type { ISeason } from "@/interface/ISeason";
import type { IVenueResponse } from "@/interface/IVenue";

export interface INewEvent {
  seasonId: number;
  venueId: number;
  name: string;
  description: string;
  date: number[];
  active: boolean;
}

interface IField {
  name: string;
  value: string | number | boolean | number[];
}

interface EventFormProps {
  event: INewEvent;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeValue: (field: IField) => void;
  isLoading: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onChangeValue,
  isLoading,
}) => {
  // Fetch seasons for the dropdown
  const { data: seasons = [], isLoading: seasonsLoading } = useGetList<
    ISeason[]
  >({
    key: "seasons",
    resource: ["seasons"],
    keyResults: "data",
    enabled: true,
  });

  // Fetch venues for the dropdown
  const { data: venues = [], isLoading: venuesLoading } = useGetList<
    IVenueResponse[]
  >({
    key: "venues",
    resource: ["venues"],
    keyResults: "data",
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
      return "";
    }
    const [year, month, day] = dateArray;
    // Ensure month and day are zero-padded
    const paddedMonth = month.toString().padStart(2, "0");
    const paddedDay = day.toString().padStart(2, "0");
    return `${year}-${paddedMonth}-${paddedDay}`;
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre del Evento
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          value={event.name}
          onChange={(e) =>
            onChangeValue({ name: "name", value: e.target.value })
          }
          placeholder="Ej. Entrenamiento Táctico Semanal"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="date" className="text-sm font-medium text-gray-700">
          Fecha del Evento
        </label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formatDateArray(event.date)}
          onChange={(e) =>
            onChangeValue({
              name: "date",
              value: parseDateToArray(e.target.value),
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="seasonId" className="text-sm font-medium text-gray-700">
          Temporada
        </label>
        <Select
          value={event.seasonId?.toString()}
          onValueChange={(value) =>
            onChangeValue({ name: "seasonId", value: parseInt(value) })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione una temporada" />
          </SelectTrigger>
          <SelectContent>
            {seasonsLoading ? (
              <SelectItem value="loading" disabled>
                Cargando...
              </SelectItem>
            ) : (
              (seasons as ISeason[]).map((season: ISeason) => (
                <SelectItem key={season.id} value={season.id.toString()}>
                  {season.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="venueId" className="text-sm font-medium text-gray-700">
          Sede
        </label>
        <Select
          value={event.venueId?.toString()}
          onValueChange={(value) =>
            onChangeValue({ name: "venueId", value: parseInt(value) })
          }
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
              (venues as IVenueResponse[]).map((venue: IVenueResponse) => (
                <SelectItem key={venue.id} value={venue.id.toString()}>
                  {venue.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 col-span-1 md:col-span-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-700"
        >
          Descripción
        </label>
        <Textarea
          id="description"
          name="description"
          value={event.description}
          onChange={(e) =>
            onChangeValue({ name: "description", value: e.target.value })
          }
          placeholder="Ej. Sesión de entrenamiento enfocada en táctica defensiva y transiciones rápidas"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="active" className="text-sm font-medium text-gray-700">
          Estado
        </label>
        <Select
          value={event.active ? "true" : "false"}
          onValueChange={(value) =>
            onChangeValue({ name: "active", value: value === "true" })
          }
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
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
};
