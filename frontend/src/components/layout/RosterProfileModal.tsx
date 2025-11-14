import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import useGetList from '@/api/services/getServices/useGetList';
import useUserStore from '@/storage/storeUser';
import type { IRoster, IRosterUpdateRequest } from '@/interface/IRoster';
import type { ILoginUser } from '@/interface/ILogin';

interface RosterProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void;
}

export const RosterProfileModal = ({ open, onOpenChange, onLogout }: RosterProfileModalProps) => {
  const { updateUser } = useUserStore();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch roster data from /roster/me/ to get all fields
  const { data: rosterData, isLoading: isLoadingRoster } = useGetList<IRoster>({
    key: 'roster-me',
    resource: ['roster/me'],
    keyResults: 'data',
    enabled: open,
  });

  // Initialize form data
  const [formData, setFormData] = useState<IRosterUpdateRequest>({
    name: '',
    email: '',
  });

  const lastLoadedIdRef = useRef<number | null>(null);

  useEffect(() => {
    const hasValidData =
      rosterData && typeof rosterData === 'object' && !Array.isArray(rosterData) && rosterData.name;

    if (hasValidData && open && lastLoadedIdRef.current !== rosterData.id) {
      setFormData({
        name: rosterData.name || '',
        email: rosterData.email || '',
      });
      lastLoadedIdRef.current = rosterData.id;
    }

    if (!open && lastLoadedIdRef.current !== null) {
      lastLoadedIdRef.current = null;
      setFormData({ name: '', email: '' });
    }
  }, [rosterData, open]);

  const validateForm = (): boolean => {
    const trimmedName = formData.name.trim();

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }

    setIsUpdating(true);

    if (!rosterData || !rosterData.id) {
      toast.error('No se pudieron cargar los datos del roster');
      setIsUpdating(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const fullRosterResponse = await fetch(
        `http://localhost:8081/api/rosters/${rosterData.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!fullRosterResponse.ok) {
        toast.error('No se pudieron cargar los datos completos del roster');
        setIsUpdating(false);
        return;
      }

      const fullRosterData = await fullRosterResponse.json();
      const fullRoster = fullRosterData.data;

      const updateData = {
        name: formData.name.trim(),
        email: fullRoster.email,
        passwordHash: fullRoster.passwordHash,
        clubId: fullRoster.clubId,
        subscriptionId: fullRoster.subscriptionId,
        creationDate: fullRoster.creationDate,
        lastAccess: fullRoster.lastAccess,
      };

      const updateResponse = await fetch(`http://localhost:8081/api/rosters/${rosterData.id}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al actualizar el perfil';

        if (errorMsg.toLowerCase().includes('duplicat')) {
          setErrorMessage('El email ya est\u00e1 en uso por otro usuario');
        } else if (errorMsg.toLowerCase().includes('unauthorized')) {
          setErrorMessage('Sesi\u00f3n expirada. Por favor, inicia sesi\u00f3n nuevamente.');
          setTimeout(() => {
            onOpenChange(false);
            onLogout();
          }, 2000);
        } else {
          setErrorMessage(errorMsg);
        }
        setIsUpdating(false);
        return;
      }

      toast.success('Perfil actualizado exitosamente');

      updateUser({
        name: updateData.name,
      } as Partial<ILoginUser>);

      queryClient.invalidateQueries({ queryKey: ['roster-me'] });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating roster:', error);
      toast.error('Error al actualizar el perfil. Por favor, intenta nuevamente.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    onOpenChange(false);
    onLogout();
  };

  const isFormValid = formData.name.trim().length >= 2 && formData.name.trim().length <= 100;

  if (isLoadingRoster) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Mi Perfil</DialogTitle>
            <DialogDescription>Cargando tu información...</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Mi Perfil</DialogTitle>
            <DialogDescription>
              Actualiza tu información personal y gestiona tu cuenta
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ingrese su nombre"
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  placeholder="email@ejemplo.com"
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={handleLogout}
                className="w-full sm:w-auto"
              >
                Cerrar Sesión
              </Button>
              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating || !isFormValid}
                  className="w-full sm:w-auto"
                >
                  {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!errorMessage} onOpenChange={() => setErrorMessage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorMessage(null)}>Entendido</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
