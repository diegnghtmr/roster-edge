import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetList from "@/api/services/getServices/useGetList";
import type { IStadium } from "@/interface/IStadium";
import type { IMatchday } from "@/interface/IMatchday";
import type { IEvent } from "@/interface/IEvent";

export interface INewMatch {
  matchdayId: number;
  startTime: number[];
  endTime: number[];
  date: number[];
  stadiumId: number;
  eventId: number;
  active: boolean;
}

interface IField {
  name: string;
  value: string | number | boolean | number[];
}

interface MatchFormProps {
  match: INewMatch;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeValue: (field: IField) => void;
  isLoading: boolean;
}

export const MatchForm: React.FC<MatchFormProps> = ({
  match,
  onSubmit,
  onChangeValue,
  isLoading,
}) => {
  // Fetch stadiums for the dropdown
  const { data: stadiums = [], isLoading: stadiumsLoading } = useGetList<
    IStadium[]
  >({
    key: "stadiums",
    resource: ["stadiums"],
    keyResults: "data",
    enabled: true,
  });

  // Fetch matchdays for the dropdown
  const { data: matchdays = [], isLoading: matchdaysLoading } = useGetList<
    IMatchday[]
  >({
    key: "matchdays",
    resource: ["matchdays"],
    keyResults: "data",
    enabled: true,
  });

  // Fetch events for the dropdown
  const { data: events = [], isLoading: eventsLoading } = useGetList<IEvent[]>({
    key: "events",
    resource: ["events"],
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

  // Parse time string (HH:MM) to array format [hour, minute]
  const parseTimeToArray = (timeString: string): number[] => {
    const [hour, minute] = timeString
      .split(":")
      .map((num) => parseInt(num, 10));
    return [hour, minute];
  };

  // Format time array [hour, minute] to string "HH:MM"
  const formatTimeArray = (timeArray: number[]): string => {
    if (!timeArray || timeArray.length !== 2) {
      return "";
    }
    const [hour, minute] = timeArray;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="space-y-2">
        <label htmlFor="date" className="text-sm font-medium text-gray-700">
          Fecha del Partido
        </label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formatDateArray(match.date)}
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
        <label
          htmlFor="startTime"
          className="text-sm font-medium text-gray-700"
        >
          Hora de Inicio
        </label>
        <Input
          id="startTime"
          name="startTime"
          type="time"
          value={formatTimeArray(match.startTime)}
          onChange={(e) =>
            onChangeValue({
              name: "startTime",
              value: parseTimeToArray(e.target.value),
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="endTime" className="text-sm font-medium text-gray-700">
          Hora de Fin
        </label>
        <Input
          id="endTime"
          name="endTime"
          type="time"
          value={formatTimeArray(match.endTime)}
          onChange={(e) =>
            onChangeValue({
              name: "endTime",
              value: parseTimeToArray(e.target.value),
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="stadiumId"
          className="text-sm font-medium text-gray-700"
        >
          Estadio
        </label>
        <Select
          value={match.stadiumId?.toString()}
          onValueChange={(value) =>
            onChangeValue({ name: "stadiumId", value: parseInt(value) })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione un estadio" />
          </SelectTrigger>
          <SelectContent>
            {stadiumsLoading ? (
              <SelectItem value="loading" disabled>
                Cargando...
              </SelectItem>
            ) : (
              (stadiums as IStadium[]).map((stadium: IStadium) => (
                <SelectItem key={stadium.id} value={stadium.id.toString()}>
                  Estadio {stadium.id} - {stadium.surface}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="matchdayId"
          className="text-sm font-medium text-gray-700"
        >
          Jornada
        </label>
        <Select
          value={match.matchdayId?.toString()}
          onValueChange={(value) =>
            onChangeValue({ name: "matchdayId", value: parseInt(value) })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione una jornada" />
          </SelectTrigger>
          <SelectContent>
            {matchdaysLoading ? (
              <SelectItem value="loading" disabled>
                Cargando...
              </SelectItem>
            ) : (
              (matchdays as IMatchday[]).map((matchday: IMatchday) => (
                <SelectItem key={matchday.id} value={matchday.id.toString()}>
                  {matchday.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="eventId" className="text-sm font-medium text-gray-700">
          Evento
        </label>
        <Select
          value={match.eventId?.toString()}
          onValueChange={(value) =>
            onChangeValue({ name: "eventId", value: parseInt(value) })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione un evento" />
          </SelectTrigger>
          <SelectContent>
            {eventsLoading ? (
              <SelectItem value="loading" disabled>
                Cargando...
              </SelectItem>
            ) : (
              (events as IEvent[]).map((event: IEvent) => (
                <SelectItem key={event.id} value={event.id.toString()}>
                  {event.name}
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
          value={match.active ? "true" : "false"}
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
