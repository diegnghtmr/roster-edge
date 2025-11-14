import { Link } from 'react-router-dom';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { Currency } from '@/interface/ICurrency';

interface CurrencyItemListProps {
  currency: Currency;
  onDelete: (id: number) => void;
}

export const CurrencyItemList = ({ currency, onDelete }: CurrencyItemListProps) => {
  // Format created date
  const formatCreatedDate = (
    dateArray: [number, number, number, number, number, number, number] | undefined
  ): string => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return 'N/A';
    }
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  };

  return (
    <TableRow key={currency.id}>
      <TableCell className="text-start font-medium">{currency.id}</TableCell>
      <TableCell className="text-start font-semibold">{currency.name}</TableCell>
      <TableCell className="text-start font-medium">{currency.symbol}</TableCell>
      <TableCell className="text-start">{formatCreatedDate(currency.createdAt)}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Link to={`/currencies/${currency.id}/edit`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(currency.id)}
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
