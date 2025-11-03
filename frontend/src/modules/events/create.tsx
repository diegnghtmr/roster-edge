import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMutateService,
  extractErrorMessage,
  type MutationResponse,
} from "@/api/services/useMutation";
import { toast } from "sonner";
import { BookmarkCheck } from "lucide-react";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { EventForm, type INewEvent } from "./components/Form";

interface IField {
  name: string;
  value: string | number | boolean | number[];
}

export const EventCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [event, setEvent] = useState<INewEvent>({
    seasonId: 0,
    venueId: 0,
    name: "",
    description: "",
    date: [
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate(),
    ],
    active: true,
  });

  const resource = ["events"];
  const { mutate } = useMutateService(resource);

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Transform data to match API expectations
      const formatDateArray = (dateArray: number[]): string => {
        const [year, month, day] = dateArray;
        const paddedMonth = month.toString().padStart(2, "0");
        const paddedDay = day.toString().padStart(2, "0");
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
            toast.error(errorMessage || "Error al crear el evento");
          } else {
            toast.success("Evento creado exitosamente");
            navigate("/events");
          }
        },
        onError: (error: Error) => {
          toast.error(
            error?.message ||
              "Error al crear el evento. Por favor, intenta nuevamente."
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

  return (
    <div className="w-full">
      <InternalHeader
        title="Eventos"
        description="Completa todos los campos para crear un nuevo evento"
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

export default EventCreateModule;
