import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterOption {
  key: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'button' | 'number' | 'date';
  options?: FilterOption[];
  placeholder?: string;
}

interface SearchComponentProps {
  filters: FilterConfig[];
  className?: string;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({ filters, className }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  // Initialize local values from URL params
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    filters.forEach((filter) => {
      const paramValue = searchParams.get(filter.key);
      if (paramValue) {
        initialValues[filter.key] = paramValue;
      }
    });
    setLocalValues(initialValues);
  }, [searchParams, filters]);

  // Debounced update function
  const updateSearchParams = useCallback(
    (key: string, value: string) => {
      const newSearchParams = new URLSearchParams(searchParams);

      if (value.trim()) {
        newSearchParams.set(key, value.trim());
      } else {
        newSearchParams.delete(key);
      }

      // Reset to page 1 when filters change
      if (key !== 'page') {
        newSearchParams.delete('page');
      }

      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  // Debounce implementation
  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];

    Object.entries(localValues).forEach(([key, value]) => {
      const timeoutId = setTimeout(() => {
        updateSearchParams(key, value);
      }, 300); // 300ms debounce

      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [localValues, updateSearchParams]);

  const handleInputChange = (key: string, value: string) => {
    setLocalValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSelectChange = (key: string, value: string) => {
    updateSearchParams(key, value);
  };

  const handleButtonClick = (key: string, value: string) => {
    const currentValue = searchParams.get(key);
    const newValue = currentValue === value ? '' : value;
    updateSearchParams(key, newValue);
  };

  const clearAllFilters = () => {
    const newSearchParams = new URLSearchParams();
    setSearchParams(newSearchParams);
    setLocalValues({});
  };

  const hasActiveFilters = filters.some((filter) => {
    if (filter.type === 'button') {
      return searchParams.get(filter.key);
    }
    return localValues[filter.key] || searchParams.get(filter.key);
  });

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        {filters.map((filter) => {
          const currentValue = localValues[filter.key] || searchParams.get(filter.key) || '';

          switch (filter.type) {
            case 'text':
            case 'number':
            case 'date': {
              const inputType =
                filter.type === 'number' ? 'number' : filter.type === 'date' ? 'date' : 'text';
              const showIcon = filter.type === 'text';
              return (
                <div key={filter.key} className="flex-1 min-w-0">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {filter.label}
                  </label>
                  <div className={cn('relative', showIcon && 'pl-0')}>
                    {showIcon && (
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    )}
                    <Input
                      type={inputType}
                      placeholder={filter.placeholder || `Buscar ${filter.label.toLowerCase()}...`}
                      value={currentValue}
                      onChange={(e) => handleInputChange(filter.key, e.target.value)}
                      className={cn(showIcon && 'pl-10')}
                    />
                  </div>
                </div>
              );
            }
            case 'select':
              return (
                <div key={filter.key} className="flex-1 min-w-0">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {filter.label}
                  </label>
                  <select
                    value={currentValue}
                    onChange={(e) => handleSelectChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">
                      {filter.placeholder || `Seleccionar ${filter.label.toLowerCase()}`}
                    </option>
                    {filter.options?.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.value}
                      </option>
                    ))}
                  </select>
                </div>
              );

            case 'button': {
              const isActive = searchParams.get(filter.key) === filter.key;
              return (
                <div key={filter.key} className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-1">{filter.label}</span>
                  <Button
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleButtonClick(filter.key, filter.key)}
                    className={cn(
                      'transition-colors text-white',
                      isActive && 'bg-blue-600 hover:bg-blue-700'
                    )}
                  >
                    {filter.label}
                  </Button>
                </div>
              );
            }

            default:
              return null;
          }
        })}

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};
