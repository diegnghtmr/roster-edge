import { Link } from 'react-router-dom';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { IStadium } from '@/interface/IStadium';

interface StadiumItemProps {
  stadium: IStadium;
  onDelete: (id: number) => void;
}

export const StadiumItem = ({ stadium, onDelete }: StadiumItemProps) => {
  // Format foundation date from array to string
  const formatFoundationDate = (dateArray: number[]): string => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return 'N/A';
    }
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  };

  return (
    <TableRow key={stadium.id}>
      <TableCell className="text-start font-medium">{stadium.id}</TableCell>
      <TableCell className="text-start font-medium">{stadium.area.toFixed(2)} m²</TableCell>
      <TableCell className="text-start font-semibold">{stadium.surface}</TableCell>
      <TableCell className="text-start font-medium">
        {stadium.totalCapacity.toLocaleString()}
      </TableCell>
      <TableCell className="text-start">{formatFoundationDate(stadium.foundation)}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Link to={`/stadiums/${stadium.id}/edit`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(stadium.id)}
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
