import { Link } from 'react-router-dom';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { StaffRole } from '@/interface/IStaffRole';

interface StaffRoleItemListProps {
  staffRole: StaffRole;
  onDelete: (id: number) => void;
}

export const StaffRoleItemList = ({ staffRole, onDelete }: StaffRoleItemListProps) => {
  // Format created date
  const formatCreatedDate = (
    createdAt: [number, number, number, number, number, number, number] | undefined
  ): string => {
    if (!createdAt || !Array.isArray(createdAt) || createdAt.length < 6) {
      return 'N/A';
    }
    const [year, month, day, hour, minute] = createdAt;
    return `${day.toString().padStart(2, '0')}/${month
      .toString()
      .padStart(2, '0')}/${year} ${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <TableRow key={staffRole.id}>
      <TableCell className="text-start font-medium">{staffRole.id}</TableCell>
      <TableCell className="text-start font-semibold">{staffRole.name}</TableCell>
      <TableCell className="text-start">{formatCreatedDate(staffRole.createdAt)}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Link to={`/staff-roles/${staffRole.id}/edit`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(staffRole.id)}
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
