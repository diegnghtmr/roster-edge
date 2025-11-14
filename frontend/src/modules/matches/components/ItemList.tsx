import { Link } from 'react-router-dom';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { IMatchSummary } from '@/interface/IMatchSummary';

interface MatchItemProps {
  match: IMatchSummary;
  onDelete: (id: number) => void;
}

const formatDateValue = (value?: number[] | string): string => {
  if (!value) return 'N/A';
  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day] = value;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }
  return 'N/A';
};

const formatTimeValue = (value?: number[] | string): string => {
  if (!value) return 'N/A';
  if (Array.isArray(value) && value.length >= 2) {
    const [hour, minute] = value;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }
  if (typeof value === 'string') {
    return value.slice(0, 5);
  }
  return 'N/A';
};

const teamLabel = (name?: string | null, club?: string | null) => {
  if (!name) return '-';
  return club ? `${name} (${club})` : name;
};

export const MatchItem = ({ match, onDelete }: MatchItemProps) => {
  return (
    <TableRow key={match.id}>
      <TableCell className="text-start font-medium">{match.id}</TableCell>
      <TableCell className="text-start">{formatDateValue(match.date)}</TableCell>
      <TableCell className="text-start">
        {formatTimeValue(match.startTime)} - {formatTimeValue(match.endTime)}
      </TableCell>
      <TableCell className="text-start">
        {teamLabel(match.homeTeamName, match.homeClubName)}
      </TableCell>
      <TableCell className="text-start">
        {teamLabel(match.awayTeamName, match.awayClubName)}
      </TableCell>

      <TableCell>
        <div className="flex gap-2">
          <Link to={`/matches/${match.id}/edit`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
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
