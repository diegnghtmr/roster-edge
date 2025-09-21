/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dataTransform from "../../transforms/transformDataGet/index";
import { fetchGet } from "../../endPoints/fetchGet";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/storage/storeUser";

interface IParamsService<T = any> {
  key: any;
  resource: string[] | undefined | null;
  params?: T;
  keyResults: string | null;
  enabled?: boolean;
  retry?: number;
}

const useGetList = <T = any>({
  key,
  resource,
  params,
  keyResults,
  enabled = true,
  retry = 3,
}: IParamsService<T>) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearUser } = useUserStore();

  if (!resource) {
    return {
      error: {},
      data: [],
      isLoading: false,
      refetch: () => {},
      isFetching: false,
    };
  }

  const paramsFetch: any = { resource, params };

  const { error, data, isLoading, refetch, isFetching } = useQuery({
    queryKey: [key],
    queryFn: () => fetchGet(paramsFetch),
    enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry,
  });

  // Manejo de errores relacionados con el token
  const handleError = (error: string) => {
    const lowerError = error?.toLowerCase();
    const isTokenError =
      lowerError.includes("token") ||
      lowerError.includes("signature") ||
      lowerError.includes("expired");

    if (isTokenError) {
      clearUser();
      queryClient.removeQueries();
      navigate("/login?error=session");
    }
  };

  if (data?.error) {
    handleError(data.error);
    return { error, data: [], isLoading, refetch, isFetching };
  }

  if (data) {
    const { metaData, results } = dataTransform(data, keyResults || "");
    return { error, data: results, metaData, isLoading, refetch, isFetching };
  }

  return { error, data: [], isLoading, refetch, isFetching };
};

export default useGetList;
