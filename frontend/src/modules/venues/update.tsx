import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VenueForm, type INewVenue } from "./components/Form";
import { useMutateService } from "@/api/services/useMutation";
import useGetList from "@/api/services/getServices/useGetList";
import { toast } from "sonner";
import type { IVenueResponse } from "@/interface/IVenue";
import type { City } from "@/interface/ICity";
import type { Club } from "@/interface/IClub";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { BookmarkCheck } from "lucide-react";

interface IField {
  name: string;
  value: string | number | boolean;
}

export const UpdateVenue = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  
  const [venue, setVenue] = useState<INewVenue>({
    name: "",
    cityId: 0,
    clubId: 0,
    email: "",
    phone: "",
    foundation: "",
    active: true,
  });

  // Fetch the venue data
  const { data: venueData, isLoading: loadingVenue } = useGetList({
    key: `venue-${id}`,
    resource: [`venues/${id}`],
    keyResults: "data",
    enabled: !!id,
  });

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

  // Populate form when venue data is loaded
  useEffect(() => {
    console.log("Fetched venue data:", venueData);
    if (venueData && venueData.id) {
      const fetchedVenue = venueData as IVenueResponse;

      setVenue({
        name: fetchedVenue.name,
        email: fetchedVenue.email,
        cityId: fetchedVenue.cityId,
        foundation: fetchedVenue.foundation,
        phone: fetchedVenue.phone,
        clubId: fetchedVenue.clubId,
        active: fetchedVenue.active,
      });
    }
  }, [venueData]);

  const resource = [`venues/${id}`];
  const { mutate } = useMutateService(resource, "", "PUT");

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
            toast.error(response.error.message || "Error al actualizar el venues");
          } else {
            toast.success("Venues actualizado exitosamente");
            navigate("/venues");
          }
        },
        onError: (error: any) => {
          toast.error(
            error?.message ||
              "Error al actualizar el venues. Por favor, intenta nuevamente.",
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

  // Show loading state while fetching any required data
  if (loadingVenue || isLoadingCities || isLoadingClubs) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-2">Cargando datos...</div>
          <div className="text-sm text-gray-500">
            {loadingVenue && "Obteniendo información de la sede"}
            {isLoadingCities && "Cargando ciudades"}
            {isLoadingClubs && "Cargando clubes"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Sedes"
        description="Actualizar los datos de la sede"
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

export default UpdateVenue;
