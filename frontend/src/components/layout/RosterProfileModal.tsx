import { useState } from 'react';
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
import { toast } from 'sonner';
import useUserStore, { getSessionToken, rosterApiUrl } from '@/storage/storeUser';
import type { IRosterSessionResponse } from '@/interface/IRoster';

interface RosterProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void;
  profile: IRosterSessionResponse;
}

export const RosterProfileModal = ({ open, onOpenChange, onLogout, profile }: RosterProfileModalProps) => {
  const updateUserName = useUserStore((state) => state.updateUserName);
  const [name, setName] = useState(profile.name);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const trimmedName = name.trim();
  const isFormValid = trimmedName.length >= 2 && trimmedName.length <= 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }

    const token = getSessionToken();
    if (!token) {
      onLogout();
      return;
    }

    setIsUpdating(true);
    try {
      const updateResponse = await fetch(rosterApiUrl(`/rosters/${profile.id}/`), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: profile.email,
          clubId: profile.clubId,
          subscriptionId: profile.subscriptionId,
        }),
      });

      if (getSessionToken() !== token) return;
      if (updateResponse.status === 401) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        onLogout();
        return;
      }
      if (!updateResponse.ok) {
        setErrorMessage('Error al actualizar el perfil');
        return;
      }

      updateUserName(trimmedName, token);
      toast.success('Perfil actualizado exitosamente');
      onOpenChange(false);
    } catch {
      toast.error('Error al actualizar el perfil. Por favor, intenta nuevamente.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    onOpenChange(false);
    onLogout();
  };

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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={profile.email}
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
