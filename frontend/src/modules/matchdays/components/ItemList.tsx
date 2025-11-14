import { Link } from 'react-router-dom';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { IMatchday } from '@/interface/IMatchday';

interface MatchdayItemProps {
  matchday: IMatchday;
  onDelete: (id: number) => void;
}

export const MatchdayItem = ({ matchday, onDelete }: MatchdayItemProps) => {
  // Truncate description for display
  const truncateDescription = (text: string, maxLength: number = 50): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <TableRow key={matchday.id}>
      <TableCell className="text-start font-medium">{matchday.id}</TableCell>
      <TableCell className="text-start font-semibold">{matchday.name}</TableCell>
      <TableCell className="text-start" title={matchday.description}>
        {truncateDescription(matchday.description)}
      </TableCell>

      <TableCell>
        <div className="flex gap-2">
          <Link to={`/matchdays/${matchday.id}/edit`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(matchday.id)}
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
