import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useMutateService,
  extractErrorMessage,
  type MutationResponse,
} from '@/api/services/useMutation';
import useGetList from '@/api/services/getServices/useGetList';
import { toast } from 'sonner';
import type { IEvent } from '@/interface/IEvent';
import { InternalHeader } from '@/components/layout/InternalHeader';
import { BookmarkCheck } from 'lucide-react';
import { EventForm, type INewEvent } from './components/Form';

interface IField {
  name: string;
  value: string | number | boolean | number[];
}

export const EventUpdateModule = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const [event, setEvent] = useState<INewEvent>({
    seasonId: 0,
    venueId: 0,
    name: '',
    description: '',
    date: [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()],
    active: true,
  });

  // Fetch the event data
  const { data: eventData, isLoading: loadingEvent } = useGetList<IEvent>({
    key: `event-${id}`,
    resource: [`events/${id}`],
    keyResults: 'data',
    enabled: !!id,
  });

  // Populate form when event data is loaded
  useEffect(() => {
    if (eventData) {
      const fetchedEvent = eventData as IEvent;
      setEvent({
        seasonId: fetchedEvent.seasonId,
        venueId: fetchedEvent.venueId,
        name: fetchedEvent.name,
        description: fetchedEvent.description,
        date: fetchedEvent.date,
        active: fetchedEvent.active,
      });
    }
  }, [eventData]);

  const resource = [`events/${id}`];
  const { mutate } = useMutateService(resource, '', 'PUT');

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Transform data to match API expectations
      const formatDateArray = (dateArray: number[]): string => {
        const [year, month, day] = dateArray;
        const paddedMonth = month.toString().padStart(2, '0');
        const paddedDay = day.toString().padStart(2, '0');
        return `${year}-${paddedMonth}-${paddedDay}`;
      };

      const eventData = {
        seasonId: event.seasonId,
        venueId: event.venueId,
        name: event.name,
        description: event.description,
        date: formatDateArray(event.date),
        active: event.active,
      };

      mutate(eventData, {
        onSuccess: (response: MutationResponse) => {
          const errorMessage = extractErrorMessage(response.error);
          if (errorMessage) {
            toast.error(errorMessage || 'Error al actualizar el evento');
          } else {
            toast.success('Evento actualizado exitosamente');
            navigate('/events');
          }
        },
        onError: (error: Error) => {
          toast.error(
            error?.message || 'Error al actualizar el evento. Por favor, intenta nuevamente.'
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [event, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setEvent({ ...event, [field.name]: field.value });
  };

  // Show loading state while fetching any required data
  if (loadingEvent) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-2">Cargando datos...</div>
          <div className="text-sm text-gray-500">
            {loadingEvent && 'Obteniendo información del evento'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Eventos"
        description="Actualizar los datos del evento"
        buttonText="Ver eventos"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/events"
      />
      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <EventForm
          event={event}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
        />
      </div>
    </div>
  );
};

export default EventUpdateModule;
