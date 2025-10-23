import { Link } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import type { TeamGender } from "@/interface/ITeamGender";

interface TeamGenderItemListProps {
  gender: TeamGender;
  onDelete: (id: number) => void;
}

export const TeamGenderItemList = ({
  gender,
  onDelete,
}: TeamGenderItemListProps) => {
  // Format created date
  const formatCreatedDate = (dateString: string | undefined): string => {
    if (!dateString) {
      return "N/A";
    }
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <TableRow key={gender.id}>
      <TableCell className="text-start font-medium">{gender.id}</TableCell>
      <TableCell className="text-start font-semibold">{gender.name}</TableCell>
      <TableCell className="text-start">
        <Badge variant={gender.active ? "default" : "secondary"}>
          {gender.active ? "Activo" : "Inactivo"}
        </Badge>
      </TableCell>
      <TableCell className="text-start">
        {formatCreatedDate(gender.createdAt)}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Link to={`/team-genders/${gender.id}/edit`}>
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
            onClick={() => onDelete(gender.id)}
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
