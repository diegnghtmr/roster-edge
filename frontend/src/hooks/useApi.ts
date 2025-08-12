import { useState, useCallback, useRef } from 'react';
import { AxiosError } from 'axios';
import type { ApiResponse } from '../types/user';

interface ApiErrorDetails {
  message: string;
  statusCode?: number;
  errorCode?: string;
  details?: unknown;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiErrorDetails | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: <P = unknown>(params?: P) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiCall: (params?: unknown) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });
  
  // Use ref to store the api call to avoid infinite loops
  const apiCallRef = useRef(apiCall);
  apiCallRef.current = apiCall;

  const execute = useCallback(async <P = unknown>(params?: P) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiCallRef.current(params as unknown);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse<unknown>>;
      const errorDetails: ApiErrorDetails = {
        message: 'An error occurred',
        statusCode: axiosError.response?.status,
        errorCode: axiosError.response?.data?.errorCode,
        details: axiosError.response?.data,
      };
      
      // Extract error message from ApiResponse structure
      if (axiosError.response?.data?.message) {
        errorDetails.message = axiosError.response.data.message;
      } else if (axiosError.response) {
        // Provide more specific error messages based on status code
        switch (axiosError.response.status) {
          case 400:
            errorDetails.message = 'Invalid request';
            break;
          case 401:
            errorDetails.message = 'Authentication required';
            break;
          case 403:
            errorDetails.message = 'Access denied';
            break;
          case 404:
            errorDetails.message = 'Resource not found';
            break;
          case 500:
            errorDetails.message = 'Server error. Please try again later';
            break;
          default:
            errorDetails.message = axiosError.message || 'An error occurred';
        }
      } else if (axiosError.request) {
        errorDetails.message = 'Network error. Please check your connection';
      } else {
        errorDetails.message = axiosError.message || 'An unexpected error occurred';
      }
      
      setState({
        data: null,
        loading: false,
        error: errorDetails,
      });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
