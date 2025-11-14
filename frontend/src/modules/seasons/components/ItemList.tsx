import { Link } from 'react-router-dom';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { ISeason } from '@/interface/ISeason';

interface SeasonItemProps {
  season: ISeason;
  onDelete: (id: number) => void;
}

export const SeasonItem = ({ season, onDelete }: SeasonItemProps) => {
  // Format date array to string
  const formatDateArray = (dateArray: number[]): string => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return 'N/A';
    }
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  };

  return (
    <TableRow key={season.id}>
      <TableCell className="text-start font-medium">{season.id}</TableCell>
      <TableCell className="text-start font-semibold">{season.name}</TableCell>
      <TableCell className="text-start">{formatDateArray(season.startDate)}</TableCell>
      <TableCell className="text-start">{formatDateArray(season.endDate)}</TableCell>

      <TableCell>
        <div className="flex gap-2">
          <Link to={`/seasons/${season.id}/edit`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(season.id)}
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
