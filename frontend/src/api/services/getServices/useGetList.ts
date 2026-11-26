import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import dataTransform from '../../transforms/transformDataGet/index';
import { fetchGet } from '../../endPoints/fetchGet';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/storage/storeUser';

type QueryKeyInput = QueryKey | string;
type RequestParams = Parameters<typeof fetchGet>[0]['params'];

interface IParamsService {
  key: QueryKeyInput;
  resource: string[] | undefined | null;
  params?: RequestParams;
  keyResults: string | null;
  enabled?: boolean;
  retry?: number;
}

const useGetList = <TData = unknown>({
  key,
  resource,
  params,
  keyResults,
  enabled = true,
  retry = 3,
}: IParamsService) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearUser = useUserStore((state) => state.clearUser);
  const hasResource = Boolean(resource?.length);

  const { error, data, isLoading, refetch, isFetching } = useQuery<unknown>({
    queryKey: typeof key === 'string' ? [key] : key,
    queryFn: () => {
      if (!resource?.length) {
        throw new Error('Resource is required to perform the request.');
      }
      return fetchGet({ resource, params });
    },
    enabled: enabled && hasResource,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry,
  });

  const apiError =
    data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
      ? data.error
      : undefined;

  useEffect(() => {
    const message = apiError?.toLowerCase();
    if (message && /token|signature|expired/.test(message)) {
      clearUser();
      queryClient.removeQueries();
      navigate('/login?error=session');
    }
  }, [apiError, clearUser, navigate, queryClient]);

  const transformed =
    data != null && !apiError && (!keyResults || typeof data === 'object')
      ? dataTransform(data, keyResults ?? '')
      : undefined;

  return {
    error: hasResource ? error : null,
    data: (transformed?.results ?? undefined) as TData | undefined,
    metaData: transformed?.metaData,
    isLoading: hasResource && isLoading,
    refetch,
    isFetching,
  };
};

export default useGetList;
