/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchDelete } from "../endPoints/fetchDelete.ts";
import useUserStore from "@/storage/storeUser.ts";

export const useMutateDeleteService: any = (resource: any) => {
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
    mutationFn: (id: string | number) => fetchDelete({ id, resource }),
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
