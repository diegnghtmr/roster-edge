import { Link } from 'react-router-dom';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { IVenueResponse } from '@/interface/IVenue';
import type { City } from '@/interface/ICity';
import type { Club } from '@/interface/IClub';

interface VenueItemListProps {
  venue: IVenueResponse;
  onDelete: (id: number) => void;
  cities?: City[];
  clubs?: Club[];
}

export const VenueItemList = ({ venue, onDelete, cities = [], clubs = [] }: VenueItemListProps) => {
  // Get city name by ID
  const getCityName = (cityId: number): string => {
    const city = cities.find((c) => c.id === cityId);
    return city?.name || 'N/A';
  };

  // Get club name by ID
  const getClubName = (clubId: number): string => {
    const club = clubs.find((c) => c.id === clubId);
    return club?.name || 'N/A';
  };

  return (
    <TableRow key={venue.id}>
      <TableCell className="text-start font-medium">{venue.id}</TableCell>
      <TableCell className="text-start font-semibold">{venue.name}</TableCell>
      <TableCell className="text-start">{venue.email}</TableCell>
      <TableCell className="text-start">{venue.phone}</TableCell>
      <TableCell className="text-start">{getCityName(venue.cityId)}</TableCell>
      <TableCell className="text-start">{getClubName(venue.clubId)}</TableCell>

      <TableCell>
        <div className="flex gap-2">
          <Link to={`/venues/${venue.id}/edit`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(venue.id)}
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
