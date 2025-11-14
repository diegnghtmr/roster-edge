/**
 * Common types shared across the application
 */

/**
 * Generic field type for dynamic form fields
 */
export interface IField {
  name: string;
  value: string | number;
}

/**
 * Generic filter configuration for reports and lists
 */
export interface IFilterField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: Array<{ value: string | number; label: string }>;
  placeholder?: string;
}

/**
 * Pagination metadata
 */
export interface IPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * API Response wrapper
 */
export interface IApiResponse<T> {
  data: T;
  meta?: IPaginationMeta;
  message?: string;
}

/**
 * Generic resource with ID
 */
export interface IResource {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Form submission state
 */
export interface IFormState<T> {
  data: T;
  isLoading: boolean;
  errors: Record<string, string>;
}

/**
 * Sort configuration
 */
export interface ISortConfig {
  field: string;
  direction: 'asc' | 'desc';
}
