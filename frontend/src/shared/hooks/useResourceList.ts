import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useGetList from '@/api/services/getServices/useGetList';
import { useMutateDeleteService } from '@/api/services/useDelete';
import { toast } from 'sonner';

interface UseResourceListConfig {
  /**
   * Resource endpoint path for fetching
   */
  resource: string[];

  /**
   * Resource endpoint path for deletion (optional, defaults to resource)
   */
  deleteResource?: string[];

  /**
   * Query key for caching
   */
  queryKey: string;

  /**
   * Key in response that contains the results
   */
  keyResults?: string;

  /**
   * Success message on delete
   */
  deleteSuccessMessage?: string;

  /**
   * Error message on delete
   */
  deleteErrorMessage?: string;

  /**
   * Resource name for messages (e.g., "país", "equipo")
   */
  resourceName?: string;
}

/**
 * Generic hook for resource list management with CRUD operations
 * Eliminates code duplication across 16+ List.tsx components
 *
 * @param config - Configuration object
 * @returns Resource list state and handlers
 */
export function useResourceList<T>(config: UseResourceListConfig) {
  const {
    resource,
    deleteResource,
    queryKey,
    keyResults = 'data',
    deleteSuccessMessage,
    deleteErrorMessage,
    resourceName = 'elemento',
  } = config;

  const [searchParams] = useSearchParams();
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // Fetch list data with search params
  const { data, isLoading, refetch, isFetching } = useGetList({
    key: queryKey,
    resource,
    keyResults,
    enabled: true,
    params: searchParams,
  });

  // Delete mutation (use deleteResource if provided, otherwise use resource)
  const deleteService = useMutateDeleteService(deleteResource || resource);

  // Auto-refetch when needed
  useEffect(() => {
    if (!isLoading && !isFetching && shouldRefetch) {
      refetch();
      setShouldRefetch(false);
    }
  }, [isLoading, isFetching, refetch, shouldRefetch]);

  // Refetch on search params change
  useEffect(() => {
    setShouldRefetch(true);
  }, [searchParams]);

  // Ensure data is properly typed as array
  const items: T[] = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    console.warn('Unexpected data structure:', data);
    return [];
  }, [data]);

  // Delete handlers
  const handleDelete = useCallback((id: number) => {
    setItemToDelete(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (itemToDelete === null) return;

    deleteService.mutate(String(itemToDelete), {
      onSuccess: () => {
        toast.success(deleteSuccessMessage || `${resourceName} eliminado exitosamente`);
        setShouldRefetch(true);
        setItemToDelete(null);
      },
      onError: () => {
        toast.error(deleteErrorMessage || `Error al eliminar el ${resourceName}`);
        setItemToDelete(null);
      },
    });
  }, [itemToDelete, deleteService, deleteSuccessMessage, deleteErrorMessage, resourceName]);

  const cancelDelete = useCallback(() => {
    setItemToDelete(null);
  }, []);

  return {
    // Data
    items,
    isLoading: isLoading || isFetching,

    // Delete state
    itemToDelete,
    isDeleting: deleteService.isPending,

    // Handlers
    handleDelete,
    confirmDelete,
    cancelDelete,
    refetch: () => setShouldRefetch(true),
  };
}
