import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VenueForm, type INewVenue } from "./components/Form";
import { useMutateService } from "@/api/services/useMutation";
import useGetList from "@/api/services/getServices/useGetList";
import { toast } from "sonner";
import { BookmarkCheck } from "lucide-react";
import { InternalHeader } from "@/components/layout/InternalHeader";
import type { City } from "@/interface/ICity";
import type { Club } from "@/interface/IClub";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface IField {
  name: string;
  value: string | number | boolean;
}

export const CreateVenue = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [venue, setVenue] = useState<INewVenue>({
    name: "",
    email: "",
    cityId: 0,
    foundation: "",
    phone: "",
    clubId: 0,
    active: true,
  });

  const resource = ["venues"];
  const { mutate } = useMutateService(resource);

  // Fetch cities
  const { data: cities = [], isLoading: isLoadingCities } = useGetList<City[]>({
    key: "cities",
    resource: ["cities"],
    keyResults: "data",
    enabled: true,
  });

  // Fetch clubs
  const { data: clubs = [], isLoading: isLoadingClubs } = useGetList<Club[]>({
    key: "clubs",
    resource: ["clubs"],
    keyResults: "data",
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
        toast.error("Por favor complete todos los campos requeridos");
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
        onSuccess: (response: any) => {
          if (response?.error) {
            // Show error dialog instead of toast
            setErrorMessage(response.error.message || "Error al crear la sede");
          } else {
            // Only redirect on success
            toast.success("Sede creada exitosamente");
            navigate("/venues");
          }
        },
        onError: (error: any) => {
          // Show error dialog for network/server errors
          setErrorMessage(
            error?.message ||
              "Error al crear la sede. Por favor, intenta nuevamente."
          );
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

      <AlertDialog
        open={!!errorMessage}
        onOpenChange={() => setErrorMessage(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error al crear la sede</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorMessage(null)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateVenue;
