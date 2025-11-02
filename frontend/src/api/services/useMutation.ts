import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import fetchMutation from "../endPoints/fetchMutation.ts";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/storage/storeUser.ts";

type MutationVariables = Record<string, unknown>;
type MutationResponse = Record<string, unknown> & {
  error?: string | { message?: string };
};

export const extractErrorMessage = (
  error: MutationResponse["error"],
): string | undefined => {
  if (!error) {
    return undefined;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && "message" in error) {
    const message = error.message;
    if (typeof message === "string") {
      return message;
    }
  }

  return undefined;
};

export const useMutateService = (
  resource: string[] = [],
  params: string = "",
  method = "POST",
  isFormData = false,
): UseMutationResult<MutationResponse, Error, MutationVariables> => {
  const queryClient = useQueryClient();
  const { clearUser } = useUserStore();
  const navigate = useNavigate();
  // In case there's a problem with the token it will take the user to login page
  const handleError = (error: string) => {
    if (
      error.toLowerCase().includes("token") ||
      error.toLowerCase().includes("signature") ||
      error.toLowerCase().includes("unauthorized") ||
      error.toLowerCase().includes("expired")
    ) {
      clearUser();
      queryClient.removeQueries();
      navigate("/login?error=session");
    }
  };

  const response = useMutation<MutationResponse, Error, MutationVariables>({
    mutationFn: (data) => {
      // Auto-detect if FormData is needed based on File objects in data
      const hasFiles =
        data &&
        typeof data === "object" &&
        Object.values(data).some((value) => value instanceof File);

      return fetchMutation({
        data,
        resource,
        params,
        method,
        isFormData: isFormData || hasFiles,
      }) as Promise<MutationResponse>;
    },
  });

  if (response.data) {
    if (response.data?.error && typeof response.data?.error === "string") {
      handleError(response.data.error);
    }
  }

  return response;
};

export type { MutationResponse, MutationVariables };
