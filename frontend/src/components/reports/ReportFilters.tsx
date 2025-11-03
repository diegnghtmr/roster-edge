import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useState } from "react";

export interface FilterField {
  key: string;
  label: string;
  type: "select" | "number" | "date" | "checkbox";
  options?: { value: string | number; label: string }[];
  placeholder?: string;
}

interface ReportFiltersProps {
  fields: FilterField[];
  filters: Record<string, string | number | boolean | undefined>;
  onFilterChange: (key: string, value: string | number | boolean) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export const ReportFilters = ({
  fields,
  filters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
}: ReportFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== null && value !== ""
  );

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtros</h3>
          {hasActiveFilters && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Activos
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Ocultar" : "Mostrar"}
        </Button>
      </div>

      {isExpanded && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                {field.type === "select" && field.options && (
                  <select
                    value={String(filters[field.key] || "")}
                    onChange={(e) => onFilterChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">
                      {field.placeholder || "Seleccionar..."}
                    </option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {field.type === "number" && (
                  <input
                    type="number"
                    value={String(filters[field.key] || "")}
                    onChange={(e) => onFilterChange(field.key, Number(e.target.value) || e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                {field.type === "date" && (
                  <input
                    type="date"
                    value={String(filters[field.key] || "")}
                    onChange={(e) => onFilterChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                {field.type === "checkbox" && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(filters[field.key])}
                      onChange={(e) =>
                        onFilterChange(field.key, e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      {field.placeholder || field.label}
                    </span>
                  </label>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={onApplyFilters} size="sm">
              Aplicar filtros
            </Button>
            {hasActiveFilters && (
              <Button
                onClick={onClearFilters}
                variant="outline"
                size="sm"
              >
                <X className="h-4 w-4" />
                Limpiar
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
