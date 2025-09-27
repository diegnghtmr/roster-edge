/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import fetchMutation from "../endPoints/fetchMutation.ts";

import { useNavigate } from "react-router-dom";
import useUserStore from "@/storage/storeUser.ts";

export const useMutateService: any = (
  resource: any = "",
  params: string = "",
  method: string = "POST",
  isFormData: boolean = false
) => {
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

  const response = useMutation({
    mutationFn: (data: { [key: string]: string | Blob }) => {
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
      });
    },
  });

  if (response.data) {
    if (response.data?.error && typeof response.data?.error === "string") {
      handleError(response.data.error);
    }
  }

  return response;
};
