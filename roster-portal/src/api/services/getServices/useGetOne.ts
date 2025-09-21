/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import { fetchGet } from '../../endPoints/fetchGet';

interface IParamsService {
  key: any;
  resource: string[];
  params?: any;
}

const useGetOne = ({ key, resource, params }: IParamsService) => {
  const paramsFetch: any = { resource, params };

  const { error, data, isLoading, refetch } = useQuery({
    queryKey: [key],
    queryFn: () => fetchGet(paramsFetch),
  });

  return { error, data, isLoading, refetch };
};

export default useGetOne;
