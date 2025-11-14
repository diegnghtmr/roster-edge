import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchGet } from "../endPoints/fetchGet.ts";
import useUserStore from "@/storage/storeUser.ts";
import { toast } from "sonner";

export const useDependencyService = (
  resource: string[],
): UseMutationResult<unknown, Error, string> => {
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
      toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.");
      navigate("/login?error=session");
    }
  };
  const response = useMutation<unknown, Error, string>({
    mutationFn: (params) => fetchGet({ resource, params }),
    onError: (error: Error) => {
      handleError(error.message);
    },
  });

  if (response.data) {
    if (response.data?.error && typeof response.data?.error === "string") {
      handleError(response.data.error);
    }
  }

  return response;
};
