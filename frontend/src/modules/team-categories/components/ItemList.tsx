import { Link } from 'react-router-dom';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import type { TeamCategory } from '@/interface/ITeamCategory';

interface TeamCategoryItemListProps {
  category: TeamCategory;
  onDelete: (id: number) => void;
}

export const TeamCategoryItemList = ({ category, onDelete }: TeamCategoryItemListProps) => {
  // Format created date
  const formatCreatedDate = (
    dateArray: [number, number, number, number, number, number, number] | undefined
  ): string => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length !== 7) {
      return 'N/A';
    }
    const [year, month, day, hour, minute] = dateArray;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  return (
    <TableRow key={category.id}>
      <TableCell className="text-start font-medium">{category.id ?? ''}</TableCell>
      <TableCell className="text-start font-semibold">{category.name}</TableCell>
      <TableCell className="text-start">
        <Badge variant={category.active ? 'default' : 'secondary'}>
          {category.active ? 'Activo' : 'Inactivo'}
        </Badge>
      </TableCell>
      <TableCell className="text-start">{formatCreatedDate(category.createdAt)}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Link to={`/team-categories/${category.id}/edit`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (category.id !== undefined) onDelete(category.id);
            }}
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
