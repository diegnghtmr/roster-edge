import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchDelete } from "../endPoints/fetchDelete.ts";
import useUserStore from "@/storage/storeUser.ts";
import { toast } from "sonner";

type DeleteVariables = string | number;
type DeleteResponse = { data: unknown; status: number };

export const useMutateDeleteService = (
  resource: string[],
): UseMutationResult<DeleteResponse, Error, DeleteVariables> => {
  const queryClient = useQueryClient();
  const { clearUser } = useUserStore();
  const navigate = useNavigate();

  // In case there's a problem with the token it will take the user to login page
  const handleError = (error: string) => {
    const lowerError = error.toLowerCase();
    const isTokenError =
      lowerError.includes("token") ||
      lowerError.includes("signature") ||
      lowerError.includes("expired") ||
      lowerError.includes("unauthorized") ||
      lowerError.includes("no autorizado") ||
      lowerError.includes("authentication") ||
      lowerError.includes("auth") ||
      lowerError.includes("jwt") ||
      lowerError.includes("session");

    if (isTokenError) {
      clearUser();
      queryClient.removeQueries();
      toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.");
      navigate("/login?error=session");
    }
  };

  const response = useMutation<DeleteResponse, Error, DeleteVariables>({
    mutationFn: (id) => fetchDelete({ id, resource }),
    onError: (error: Error) => {
      handleError(error.message);
    },
  });

  if (response?.data) {
    if (
      response?.data?.data.error &&
      typeof response.data?.data.error === "string"
    ) {
      handleError(response.data.data.error);
    }
  }

  return response;
};
