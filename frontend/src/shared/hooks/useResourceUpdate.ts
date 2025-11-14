import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import useGetById from '@/api/services/getServices/useGetOne';
import { useMutateService } from "@/api/services/useMutation";

/**
 * Generic hook for resource update
 * Eliminates code duplication across 14+ update.tsx components
 *
 * @param resource - API resource endpoint path array
 * @param config - Configuration options
 * @returns Update state and handlers
 */
export function useResourceUpdate<T>(
  resource: string[],
  config?: {
    redirectPath?: string;
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (data: unknown) => void;
    onError?: (error: Error) => void;
    transform?: (data: unknown) => T;
  }
) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entity, setEntity] = useState<T>({} as T);

  // Fetch existing data
  const { data, isLoading: isFetching } = useGetById({
    key: [resource.join('-'), id],
    resource,
    params: id || '',
  });

  // Update mutation
  const { mutate } = useMutateService(resource, '', 'PUT');

  // Populate form with fetched data
  useEffect(() => {
    if (data) {
      const transformedData = config?.transform ? config.transform(data) : (data as T);
      setEntity(transformedData);
    }
  }, [data, config]);

  const handleChange = useCallback((field: keyof T, value: unknown) => {
    setEntity((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!id) return;

      setIsSubmitting(true);

      mutate(
        { id, data: entity },
        {
          onSuccess: (response) => {
            toast.success(
              config?.successMessage || `${resource[resource.length - 1]} actualizado exitosamente`
            );

            config?.onSuccess?.(response);

            if (config?.redirectPath) {
              navigate(config.redirectPath);
            }
          },
          onError: (error) => {
            console.error('Error updating resource:', error);
            toast.error(
              config?.errorMessage || `Error al actualizar ${resource[resource.length - 1]}`
            );

            config?.onError?.(error as Error);
          },
          onSettled: () => {
            setIsSubmitting(false);
          },
        }
      );
    },
    [id, entity, mutate, navigate, config, resource]
  );

  return {
    entity,
    isLoading: isFetching,
    isSubmitting,
    handleChange,
    handleSubmit,
    setEntity,
  };
}
