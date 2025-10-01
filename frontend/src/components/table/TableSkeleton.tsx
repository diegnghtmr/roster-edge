import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { TableColumn } from "./DataTable";

interface TableSkeletonProps {
  headers: TableColumn[];
  rows?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  headers,
  rows = 5,
  className,
}) => {
  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead
                key={header.key}
                className={cn("font-semibold", header.className)}
              >
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header) => (
                <TableCell key={header.key}>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
