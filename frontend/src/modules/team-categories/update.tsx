import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TeamCategoryForm, type INewTeamCategory } from "./components/Form";
import { useMutateService } from "@/api/services/useMutation";
import useGetList from "@/api/services/getServices/useGetList";
import { toast } from "sonner";
import type { TeamCategory } from "@/interface/ITeamCategory";
import { InternalHeader } from "@/components/layout/InternalHeader";
import { BookmarkCheck } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface IField {
  name: string;
  value: string | boolean;
}

export const TeamCategoryUpdateModule = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  
  const [category, setCategory] = useState<INewTeamCategory>({
    name: "",
    active: true,
  });

  // Fetch the category data
  const { data: categoryData, isLoading: loadingCategory } = useGetList({
    key: `team-category-${id}`,
    resource: [`team-categories/${id}`],
    keyResults: "data",
    enabled: !!id,
  });

  // Populate form when category data is loaded
  useEffect(() => {
    if (categoryData) {
      const fetchedCategory = categoryData as TeamCategory;
      
      setCategory({
        name: fetchedCategory.name,
        active: fetchedCategory.active
      });
    }
  }, [categoryData]);

  const resource = [`team-categories/${id}`];
  const { mutate } = useMutateService(resource, "", "PUT");
  
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

      // Data for update
      const categoryData = {
        name: category.name,
        active: category.active
      };

      mutate(categoryData, {
        onSuccess: (response: any) => {
          if (response?.error) {
            toast.error(response.error.message || "Error al actualizar el team-categories");
          } else {
            toast.success("Team-categories actualizado exitosamente");
            navigate("/team-categories");
          }
        },
        onError: (error: any) => {
          toast.error(
            error?.message ||
              "Error al actualizar el team-categories. Por favor, intenta nuevamente.",
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

  // Show loading state while fetching any required data
  if (loadingCategory) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner />
          <div className="mt-2">Cargando información de la categoría...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InternalHeader
        title="Categorías de Equipos"
        description="Actualizar los datos de la categoría"
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
          isEdit={true}
        />
      </div>

      
    </div>
  );
};

export default TeamCategoryUpdateModule;