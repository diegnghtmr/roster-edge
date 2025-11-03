import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import dataTransform from "../../transforms/transformDataGet/index";
import { fetchGet } from "../../endPoints/fetchGet";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/storage/storeUser";

type QueryKeyInput = QueryKey | string;
type RequestParams = Record<string, string> | URLSearchParams | string | undefined;

interface IParamsService<TParams = RequestParams> {
  key: QueryKeyInput;
  resource: string[] | undefined | null;
  params?: TParams;
  keyResults: string | null;
  enabled?: boolean;
  retry?: number;
}

interface ApiResponse<TData> {
  metaData?: Record<string, unknown>;
  results?: TData;
  error?: string;
}

const useGetList = <TData = unknown>({
  key,
  resource,
  params,
  keyResults,
  enabled = true,
  retry = 3,
}: IParamsService<RequestParams>) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearUser } = useUserStore();

  const hasResource = Array.isArray(resource) ? resource.length > 0 : Boolean(resource);
  const queryKeyValue = (Array.isArray(key) ? key : [key]) as QueryKey;
  const paramsFetch = hasResource ? { resource: resource as string[], params } : null;

  const { error, data, isLoading, refetch, isFetching } = useQuery<ApiResponse<TData>>({
    queryKey: queryKeyValue,
    queryFn: () => {
      if (!paramsFetch) {
        throw new Error("Resource is required to perform the request.");
      }
      return fetchGet(paramsFetch);
    },
    enabled: enabled && hasResource,
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
    return { error, data: results as TData, metaData, isLoading, refetch, isFetching };
  }

  if (!hasResource) {
    return {
      error: null,
      data: [],
      isLoading: false,
      refetch,
      isFetching,
    };
  }

  return { error, data: [], isLoading, refetch, isFetching };
};

export default useGetList;
