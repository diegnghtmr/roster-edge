import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchGet } from "../endPoints/fetchGet.ts";
import useUserStore from "@/storage/storeUser.ts";

export const useDependencyService = (
  resource: string[],
): UseMutationResult<unknown, Error, string> => {
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
      navigate("/login?error=session");
    }
  };
  const response = useMutation<unknown, Error, string>({
    mutationFn: (params) => fetchGet({ resource, params }),
  });

  if (response.data) {
    if (response.data?.error && typeof response.data?.error === "string") {
      handleError(response.data.error);
    }
  }

  return response;
};
