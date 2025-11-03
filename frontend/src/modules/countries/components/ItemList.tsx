import { Link } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Country } from "@/interface/ICountry";

interface CountryItemListProps {
  country: Country;
  onDelete: (id: number) => void;
}

export const CountryItemList = ({
  country,
  onDelete,
}: CountryItemListProps) => {
  // Format created date
  const formatCreatedDate = (
    dateArray:
      | [number, number, number, number, number, number, number]
      | undefined
  ): string => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return "N/A";
    }
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  return (
    <TableRow key={country.id}>
      <TableCell className="text-start font-medium">{country.id}</TableCell>
      <TableCell className="text-start font-semibold">{country.name}</TableCell>

      <TableCell className="text-start">
        {formatCreatedDate(country.createdAt)}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Link to={`/countries/${country.id}/edit`}>
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
            onClick={() => onDelete(country.id)}
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
