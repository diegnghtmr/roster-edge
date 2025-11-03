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

export interface INewTeamGender {
  name: string;
  active?: boolean;
}

interface IField {
  name: string;
  value: string | boolean;
}

interface TeamGenderFormProps {
  gender: INewTeamGender;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeValue: (field: IField) => void;
  isLoading: boolean;
  isEdit?: boolean;
}

export const TeamGenderForm: React.FC<TeamGenderFormProps> = ({
  gender,
  onSubmit,
  onChangeValue,
  isLoading,
  isEdit = false,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre del género
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          value={gender.name}
          onChange={(e) =>
            onChangeValue({ name: "name", value: e.target.value })
          }
          placeholder="Ingrese el nombre del género (ej. MASCULINO, FEMENINO, MIXTO)"
          required
        />
      </div>

      {isEdit && (
        <div className="space-y-2">
          <label htmlFor="active" className="text-sm font-medium text-gray-700">
            Estado
          </label>
          <Select
            value={gender.active?.toString() || "true"}
            onValueChange={(value) =>
              onChangeValue({ name: "active", value: value === "true" })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Activo</SelectItem>
              <SelectItem value="false">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end col-span-1 md:col-span-2">
        <Button type="submit" disabled={isLoading} className="max-w-[200px]">
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
};