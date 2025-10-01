import React, { useEffect, useState } from "react";

import type { FilterConfig } from "@/components/table/SearchComponent";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import type { Team } from "./interfaces/ITeam";
import useGetList from "@/api/services/getServices/useGetList";
import { useSearchParams } from "react-router-dom";
import { DataTable, type TableColumn } from "@/components/table/DataTable";

// Mock data - replace with actual API call
// Define table headers
const headers: TableColumn[] = [
  { title: "ID", key: "id", className: "w-16" },
  { title: "Nombre", key: "name" },
  { title: "Mascota", key: "mascot" },
  { title: "Fundación", key: "foundation" },
  { title: "Estado", key: "active", className: "w-24" },
  { title: "Fecha de creación", key: "createdAt" },
  { title: "Acciones", key: "actions", className: "w-32" },
];

// Define filters for search component
const filters: FilterConfig[] = [
  {
    key: "name",
    label: "Nombre",
    type: "text",
    placeholder: "Buscar por nombre...",
  },
  {
    key: "mascot",
    label: "Mascota",
    type: "text",
    placeholder: "Buscar por mascota...",
  },
  {
    key: "active",
    label: "Estado",
    type: "select",
    options: [
      { key: "true", value: "Activo" },
      { key: "false", value: "Inactivo" },
    ],
    placeholder: "Seleccionar estado",
  },
];

const TeamsModule: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const { data, isLoading, refetch, isFetching, error } = useGetList({
    key: "teamsList",
    resource: ["teams"],
    keyResults: "data",
    enabled: true,
    params: searchParams,
  });

  // Avoid infinity loops handle manually refetch
  useEffect(() => {
    // If it's not loading nor fetching it will refetch
    if (!isLoading && !isFetching && shouldRefetch) {
      refetch();
      setShouldRefetch(false); // Reset the value to avoid loops
    }
  }, [isLoading, isFetching, refetch, shouldRefetch]);

  // Detect changes in searchparams to do the refetch
  useEffect(() => {
    setShouldRefetch(true); // Set the refetch should be done
  }, [searchParams]);

  // Ensure data is properly typed as Team array
  // The useGetList hook with keyResults: 'data' should return the teams array directly
  const teams: Team[] = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    console.warn("Unexpected data structure:", data);
    return [];
  }, [data]);

  // Debug logging to understand data structure
  console.log("Teams data:", data);
  console.log("Teams array:", teams);
  console.log("Is loading:", isLoading);
  console.log("Error:", error);

  // Show error state if there's an error
  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Equipos</h1>
          <p className="text-gray-600 mt-2">
            Gestiona los equipos de tu organización
          </p>
        </div>
        <div className="text-center text-red-500">
          Error al cargar los equipos. Por favor, intenta de nuevo.
        </div>
      </div>
    );
  }

  // Format foundation date
  const formatFoundationDate = (
    foundation: [number, number, number] | undefined
  ): string => {
    if (!foundation || !Array.isArray(foundation) || foundation.length !== 3) {
      return "N/A";
    }
    const [year, month, day] = foundation;
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  // Format created date
  const formatCreatedDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha inválida";
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  // Handle edit action
  const handleEdit = (team: Team) => {
    console.log("Edit team:", team);
    // TODO: Implement edit functionality
  };

  // Handle delete action
  const handleDelete = (team: Team) => {
    console.log("Delete team:", team);
    // TODO: Implement delete functionality with confirmation
  };

  // Render function for each row
  const renderRow = (team: Team) => (
    <TableRow key={team.id}>
      <TableCell className="text-start font-medium">{team.id}</TableCell>
      <TableCell className="text-start font-semibold">{team.name}</TableCell>
      <TableCell className="text-start">{team.mascot}</TableCell>
      <TableCell className="text-start">
        {formatFoundationDate(team.foundation)}
      </TableCell>
      <TableCell className="text-start">
        <Badge variant={team.active ? "default" : "secondary"}>
          {team.active ? "Activo" : "Inactivo"}
        </Badge>
      </TableCell>
      <TableCell className="text-start">
        {formatCreatedDate(team.createdAt)}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(team)}
            className="flex items-center text-white gap-1"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(team)}
            className="flex items-center gap-1 text-white hover:text-red-700 "
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Equipos</h1>
        <p className="text-gray-600 mt-2">
          Gestiona los equipos de tu organización
        </p>
      </div>

      <DataTable
        data={teams}
        headers={headers}
        filters={filters}
        renderRow={renderRow}
        loading={isLoading}
        emptyMessage="No se encontraron equipos"
        className="mt-6"
      />
    </div>
  );
};

export default TeamsModule;
