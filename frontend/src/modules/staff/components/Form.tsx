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
import type { StaffRole } from "@/interface/IStaffRole";
import type { Team } from "@/interface/ITeam";
import type { City } from "@/interface/ICity";

export interface INewStaff {
  name: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  hireDate: string;
  cityId: number;
  staffRoleId: number;
  teamId: number;
}

interface IField {
  name: string;
  value: string | number;
}

interface StaffFormProps {
  staff: INewStaff;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeValue: (field: IField) => void;
  isLoading: boolean;
  cities?: City[];
  staffRoles?: StaffRole[];
  teams?: Team[];
  isUpdate?: boolean;
}

export const StaffForm: React.FC<StaffFormProps> = ({
  staff,
  onSubmit,
  onChangeValue,
  isLoading,
  cities = [],
  staffRoles = [],
  teams = [],
  isUpdate = false,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          value={staff.name}
          onChange={(e) =>
            onChangeValue({ name: "name", value: e.target.value })
          }
          placeholder="Ingrese el nombre"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
          Apellido
        </label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          value={staff.lastName}
          onChange={(e) =>
            onChangeValue({ name: "lastName", value: e.target.value })
          }
          placeholder="Ingrese el apellido"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={staff.email}
          onChange={(e) =>
            onChangeValue({ name: "email", value: e.target.value })
          }
          placeholder="Ingrese el correo electrónico"
          required
        />
      </div>

      {!isUpdate && (
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={staff.password}
            onChange={(e) =>
              onChangeValue({ name: "password", value: e.target.value })
            }
            placeholder="Ingrese la contraseña"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Teléfono
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={staff.phone}
          onChange={(e) =>
            onChangeValue({ name: "phone", value: e.target.value })
          }
          placeholder="Ingrese el teléfono"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="birthDate"
          className="text-sm font-medium text-gray-700"
        >
          Fecha de nacimiento
        </label>
        <Input
          id="birthDate"
          name="birthDate"
          type="date"
          value={staff.birthDate}
          onChange={(e) =>
            onChangeValue({ name: "birthDate", value: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="hireDate" className="text-sm font-medium text-gray-700">
          Fecha de contratación
        </label>
        <Input
          id="hireDate"
          name="hireDate"
          type="date"
          value={staff.hireDate}
          onChange={(e) =>
            onChangeValue({ name: "hireDate", value: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="cityId" className="text-sm font-medium text-gray-700">
          Ciudad
        </label>
        <Select
          value={staff.cityId?.toString()}
          onValueChange={(value) =>
            onChangeValue({ name: "cityId", value: parseInt(value) })
          }
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
        <label
          htmlFor="staffRoleId"
          className="text-sm font-medium text-gray-700"
        >
          Rol
        </label>
        <Select
          value={staff.staffRoleId?.toString()}
          onValueChange={(value) =>
            onChangeValue({ name: "staffRoleId", value: parseInt(value) })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione un rol" />
          </SelectTrigger>
          <SelectContent>
            {staffRoles.map((role) => (
              <SelectItem key={role.id} value={role.id.toString()}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="teamId" className="text-sm font-medium text-gray-700">
          Equipo
        </label>
        <Select
          value={staff.teamId?.toString()}
          onValueChange={(value) =>
            onChangeValue({ name: "teamId", value: parseInt(value) })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione un equipo" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id.toString()}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end col-span-1 md:col-span-2 xl:col-span-3">
        <Button type="submit" disabled={isLoading} className="max-w-[200px]">
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
};
