import { Link } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import type { IEvent } from "@/interface/IEvent";

interface EventItemProps {
  event: IEvent;
  onDelete: (id: number) => void;
}

export const EventItem = ({ event, onDelete }: EventItemProps) => {
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

  // Truncate description for display
  const truncateDescription = (
    text: string,
    maxLength: number = 50
  ): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <TableRow key={event.id}>
      <TableCell className="text-start font-medium">{event.id}</TableCell>
      <TableCell className="text-start font-semibold">{event.name}</TableCell>
      <TableCell className="text-start" title={event.description}>
        {truncateDescription(event.description)}
      </TableCell>
      <TableCell className="text-start">
        {formatDateArray(event.date)}
      </TableCell>
      <TableCell className="text-start font-medium">{event.seasonId}</TableCell>
      <TableCell className="text-start font-medium">{event.venueId}</TableCell>
      <TableCell className="text-start">
        <Badge variant={event.active ? "default" : "secondary"}>
          {event.active ? "Activo" : "Inactivo"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Link to={`/events/${event.id}/edit`}>
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
            onClick={() => onDelete(event.id)}
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
