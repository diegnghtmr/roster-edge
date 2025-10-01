import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchComponent } from "./SearchComponent";
import type { FilterConfig } from "./SearchComponent";
import { cn } from "@/lib/utils";
import { TableSkeleton } from "./TableSkeleton";
import { EmptyState } from "./EmptyState";
export interface TableColumn {
  title: string;
  key: string;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  headers: TableColumn[];
  filters?: FilterConfig[];
  renderRow: (item: T) => React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  showSearch?: boolean;
}

export function DataTable<T>({
  data,
  headers,
  filters = [],
  renderRow,
  loading = false,
  emptyMessage = "No se encontraron registros",
  className,
  showSearch = true,
}: DataTableProps<T>) {
  if (loading) {
    return <TableSkeleton headers={headers} />;
  }

  const hasData = data && data.length > 0;

  return (
    <div className={cn("space-y-4", className)}>
      {showSearch && filters.length > 0 && (
        <SearchComponent filters={filters} />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead
                  key={header.key}
                  className={cn("font-semibold", header.className)}
                >
                  {header.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {hasData ? (
              data.map((item) => renderRow(item))
            ) : (
              <TableRow>
                <TableCell colSpan={headers.length} className="h-24">
                  <EmptyState message={emptyMessage} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
