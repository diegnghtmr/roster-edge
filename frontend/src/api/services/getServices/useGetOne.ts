import { useQuery } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import { fetchGet } from '../../endPoints/fetchGet';

interface IParamsService {
  key: QueryKey | string;
  resource: string[];
  params?: Parameters<typeof fetchGet>[0]['params'];
}

const useGetOne = ({ key, resource, params }: IParamsService) => {
  const { error, data, isLoading, refetch } = useQuery<unknown>({
    queryKey: [key],
    queryFn: () => fetchGet({ resource, params }),
  });

  return { error, data, isLoading, refetch };
};

export default useGetOne;
