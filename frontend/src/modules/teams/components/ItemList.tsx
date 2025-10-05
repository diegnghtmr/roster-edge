import { Link } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import type { Team } from "@/interface/ITeam";

interface TeamItemListProps {
  team: Team;
  onDelete: (id: number) => void;
}

export const TeamItemList = ({ team, onDelete }: TeamItemListProps) => {
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

  return (
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
          <Link to={`/teams/${team.id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(team.id)}
            className="flex items-center gap-1 text-red-700 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
