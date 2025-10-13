import { Link } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import type { Staff } from "@/interface/IStaff";

interface StaffItemListProps {
  staff: Staff;
  onDelete: (id: number) => void;
}

export const StaffItemList = ({ staff, onDelete }: StaffItemListProps) => {
  // Format date arrays
  const formatDate = (
    dateArray: [number, number, number] | undefined
  ): string => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length !== 3) {
      return "N/A";
    }
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  // Format created date
  const formatCreatedDate = (
    createdAt:
      | [number, number, number, number, number, number, number]
      | undefined
  ): string => {
    if (!createdAt || !Array.isArray(createdAt) || createdAt.length < 6) {
      return "N/A";
    }
    const [year, month, day, hour, minute] = createdAt;
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year} ${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <TableRow key={staff.id}>
      <TableCell className="text-start font-medium">{staff.id}</TableCell>
      <TableCell className="text-start font-semibold">
        {staff.name} {staff.lastName}
      </TableCell>
      <TableCell className="text-start">{staff.email}</TableCell>
      <TableCell className="text-start">{staff.phone}</TableCell>
      <TableCell className="text-start">
        {formatDate(staff.birthDate)}
      </TableCell>
      <TableCell className="text-start">{formatDate(staff.hireDate)}</TableCell>
      <TableCell className="text-start">
        <Badge variant={staff.active ? "default" : "secondary"}>
          {staff.active ? "Activo" : "Inactivo"}
        </Badge>
      </TableCell>
      <TableCell className="text-start">
        {formatCreatedDate(staff.createdAt)}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Link to={`/staff/${staff.id}/edit`}>
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
            onClick={() => onDelete(staff.id)}
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
