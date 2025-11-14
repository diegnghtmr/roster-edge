import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VenueForm, type INewVenue } from './components/Form';
import {
  useMutateService,
  extractErrorMessage,
  type MutationResponse,
} from '@/api/services/useMutation';
import useGetList from '@/api/services/getServices/useGetList';
import { toast } from 'sonner';
import { BookmarkCheck } from 'lucide-react';
import { InternalHeader } from '@/components/layout/InternalHeader';
import type { City } from '@/interface/ICity';
import type { Club } from '@/interface/IClub';
import { Spinner } from '@/components/ui/spinner';

interface IField {
  name: string;
  value: string | number | boolean;
}

export const CreateVenue = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [venue, setVenue] = useState<INewVenue>({
    name: '',
    email: '',
    cityId: 0,
    foundation: '',
    phone: '',
    clubId: 0,
    active: true,
  });

  const resource = ['venues'];
  const { mutate } = useMutateService(resource);

  // Fetch cities
  const { data: cities = [], isLoading: isLoadingCities } = useGetList<City[]>({
    key: 'cities',
    resource: ['cities'],
    keyResults: 'data',
    enabled: true,
  });

  // Fetch clubs
  const { data: clubs = [], isLoading: isLoadingClubs } = useGetList<Club[]>({
    key: 'clubs',
    resource: ['clubs'],
    keyResults: 'data',
    enabled: true,
  });

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Validate that required fields are completed
      if (
        !venue.cityId ||
        !venue.clubId ||
        !venue.name ||
        !venue.email ||
        !venue.phone ||
        !venue.foundation
      ) {
        toast.error('Por favor complete todos los campos requeridos');
        setIsLoading(false);
        return;
      }

      // Data already matches API expectations
      const venueData = {
        name: venue.name,
        email: venue.email,
        cityId: venue.cityId,
        foundation: venue.foundation,
        phone: venue.phone,
        clubId: venue.clubId,
        active: venue.active,
      };

      mutate(venueData, {
        onSuccess: (response: MutationResponse) => {
          const errorMessage = extractErrorMessage(response.error);
          if (errorMessage) {
            toast.error(errorMessage || 'Error al crear el venues');
          } else {
            toast.success('Venues creado exitosamente');
            navigate('/venues');
          }
        },
        onError: (error: Error) => {
          toast.error(error?.message || 'Error al crear el venues. Por favor, intenta nuevamente.');
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [venue, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setVenue({ ...venue, [field.name]: field.value });
  };

  // Show loading spinner while fetching initial data
  if (isLoadingCities || isLoadingClubs) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Sedes"
        description="Completa todos los campos para crear una nueva sede"
        buttonText="Ver sedes"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/venues"
      />

      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <VenueForm
          venue={venue}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
          cities={cities}
          clubs={clubs}
        />
      </div>
    </div>
  );
};

export default CreateVenue;
