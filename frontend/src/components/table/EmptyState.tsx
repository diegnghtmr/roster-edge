import React from "react";
import { FileX } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No se encontraron registros",
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="mb-4 text-gray-400">
        {icon || <FileX className="h-12 w-12" />}
      </div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
};
