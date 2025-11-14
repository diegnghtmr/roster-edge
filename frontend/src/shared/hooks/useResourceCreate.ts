import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useMutateService,
  extractErrorMessage,
  type MutationResponse,
} from '@/api/services/useMutation';

/**
 * Generic hook for resource creation
 * Eliminates code duplication across 14+ create.tsx components
 *
 * @param resource - API resource endpoint path array
 * @param config - Configuration options
 * @returns Create state and handlers
 */
export function useResourceCreate<T>(
  resource: string[],
  config?: {
    redirectPath?: string;
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (data: unknown) => void;
    onError?: (error: Error) => void;
  }
) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [entity, setEntity] = useState<T>({} as T);

  const { mutate } = useMutateService(resource);

  const handleChange = useCallback((field: keyof T, value: unknown) => {
    setEntity((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      mutate(entity, {
        onSuccess: (response: MutationResponse) => {
          const errorMessage = extractErrorMessage(response.error);
          if (errorMessage) {
            toast.error(
              errorMessage ||
                config?.errorMessage ||
                `Error al crear ${resource[resource.length - 1]}`
            );
            setIsLoading(false);
          } else {
            toast.success(
              config?.successMessage || `${resource[resource.length - 1]} creado exitosamente`
            );

            config?.onSuccess?.(response);

            if (config?.redirectPath) {
              navigate(config.redirectPath);
            }
            setIsLoading(false);
          }
        },
        onError: (error: Error) => {
          console.error('Error creating resource:', error);
          toast.error(
            error?.message ||
              config?.errorMessage ||
              `Error al crear ${resource[resource.length - 1]}`
          );

          config?.onError?.(error);
          setIsLoading(false);
        },
      });
    },
    [entity, mutate, navigate, config, resource]
  );

  const reset = useCallback(() => {
    setEntity({} as T);
    setIsLoading(false);
  }, []);

  return {
    entity,
    isLoading,
    handleChange,
    handleSubmit,
    setEntity,
    reset,
  };
}
