import { TableCell, TableRow } from '@/components/ui/table';
import type { StaffRole } from '@/interface/IStaffRole';

interface StaffRoleItemListProps {
  staffRole: StaffRole;
}

export const StaffRoleItemList = ({ staffRole }: StaffRoleItemListProps) => {
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
    </TableRow>
  );
};
