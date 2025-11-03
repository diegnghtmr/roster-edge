import { Link } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { IMatch } from "@/interface/IMatch";

interface MatchItemProps {
  match: IMatch;
  onDelete: (id: number) => void;
}

export const MatchItem = ({ match, onDelete }: MatchItemProps) => {
  // Format date array to string
  const formatDateArray = (dateArray: number[]): string => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return "N/A";
    }
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  // Format time array to string
  const formatTimeArray = (timeArray: number[]): string => {
    if (!timeArray || !Array.isArray(timeArray) || timeArray.length < 2) {
      return "N/A";
    }
    const [hour, minute] = timeArray;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <TableRow key={match.id}>
      <TableCell className="text-start font-medium">{match.id}</TableCell>
      <TableCell className="text-start">
        {formatDateArray(match.date)}
      </TableCell>
      <TableCell className="text-start">
        {formatTimeArray(match.startTime)} - {formatTimeArray(match.endTime)}
      </TableCell>

      <TableCell>
        <div className="flex gap-2">
          <Link to={`/matches/${match.id}/edit`}>
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
            onClick={() => onDelete(match.id)}
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
