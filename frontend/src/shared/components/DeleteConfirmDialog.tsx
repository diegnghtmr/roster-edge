import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  resourceName?: string;
  isDeleting?: boolean;
}

/**
 * Reusable delete confirmation dialog with accessibility support
 * Eliminates code duplication across all List components
 */
export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  description,
  resourceName = 'elemento',
  isDeleting = false,
}) => {
  const defaultDescription = `Esta acción no se puede deshacer. El ${resourceName} será eliminado permanentemente del sistema.`;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent role="alertdialog" aria-labelledby="alert-dialog-title">
        <AlertDialogHeader>
          <AlertDialogTitle id="alert-dialog-title">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description || defaultDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Cancelar eliminación"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            disabled={isDeleting}
            aria-label={`Confirmar eliminación de ${resourceName}`}
            aria-busy={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
