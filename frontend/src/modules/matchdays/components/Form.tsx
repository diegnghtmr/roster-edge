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

export interface INewMatchday {
  name: string;
  description: string;
  active: boolean;
}

interface IField {
  name: string;
  value: string | number | boolean;
}

interface MatchdayFormProps {
  matchday: INewMatchday;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeValue: (field: IField) => void;
  isLoading: boolean;
}

export const MatchdayForm: React.FC<MatchdayFormProps> = ({
  matchday,
  onSubmit,
  onChangeValue,
  isLoading,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre de la Jornada
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          value={matchday.name}
          onChange={(e) =>
            onChangeValue({ name: "name", value: e.target.value })
          }
          placeholder="Ej. Jornada 1"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="active" className="text-sm font-medium text-gray-700">
          Estado
        </label>
        <Select
          value={matchday.active ? "true" : "false"}
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
          value={matchday.description}
          onChange={(e) =>
            onChangeValue({ name: "description", value: e.target.value })
          }
          placeholder="Ej. Primera jornada de la temporada regular"
          rows={3}
          required
        />
      </div>

      <div className="flex justify-end col-span-1 md:col-span-2">
        <Button type="submit" disabled={isLoading} className="max-w-[200px]">
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
};
