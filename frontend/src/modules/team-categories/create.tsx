import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TeamCategoryForm, type INewTeamCategory } from "./components/Form";
import {
  useMutateService,
  extractErrorMessage,
  type MutationResponse,
} from "@/api/services/useMutation";
import { toast } from "sonner";
import { BookmarkCheck } from "lucide-react";
import { InternalHeader } from "@/components/layout/InternalHeader";

interface IField {
  name: string;
  value: string | boolean;
}

export const TeamCategoryCreateModule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [category, setCategory] = useState<INewTeamCategory>({
    name: "",
  });

  const resource = ["team-categories"];
  const { mutate } = useMutateService(resource);

  // Handle the form submit event
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Validate required fields
      if (!category.name) {
        toast.error("Por favor complete todos los campos requeridos");
        setIsLoading(false);
        return;
      }

      // Data already matches API expectations
      const categoryData = {
        name: category.name,
      };

      mutate(categoryData, {
        onSuccess: (response: MutationResponse) => {
          const errorMessage = extractErrorMessage(response.error);
          if (errorMessage) {
            toast.error(
              errorMessage || "Error al crear el team-categories",
            );
          } else {
            toast.success("Team-categories creado exitosamente");
            navigate("/team-categories");
          }
        },
        onError: (error: Error) => {
          toast.error(
            error?.message ||
              "Error al crear el team-categories. Por favor, intenta nuevamente.",
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    },
    [category, mutate, navigate]
  );

  // Set the values after field changes
  const handleChangeValue = (field: IField) => {
    setCategory({ ...category, [field.name]: field.value });
  };

  return (
    <div className="w-full">
      <InternalHeader
        title="Categorías de Equipos"
        description="Completa todos los campos para crear una nueva categoría"
        buttonText="Ver categorías"
        buttonIcon={<BookmarkCheck className="h-4 w-4" />}
        buttonLink="/team-categories"
      />

      <div className="bg-white p-4 w-full shadow-md rounded-lg">
        <TeamCategoryForm
          category={category}
          isLoading={isLoading}
          onChangeValue={handleChangeValue}
          onSubmit={handleOnSubmit}
        />
      </div>

      
    </div>
  );
};

export default TeamCategoryCreateModule;
