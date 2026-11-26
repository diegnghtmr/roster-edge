import { useRef, useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ClipboardCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { IMatchSummary } from '@/interface/IMatchSummary';
import useUserStore, { getApiData, getSessionToken, rosterApiUrl } from '@/storage/storeUser';

const MAX_SCORE = 2_147_483_647;
const SAVE_ERROR = 'Error al guardar el resultado. Por favor, intenta nuevamente.';

const scoreFields = [
  { name: 'homeScore', label: 'Goles local', team: 'homeTeamName' },
  { name: 'awayScore', label: 'Goles visitante', team: 'awayTeamName' },
] as const;

type ScoreName = (typeof scoreFields)[number]['name'];
type FormError = { message: string; fields?: Partial<Record<ScoreName, string>> };

function isValidScore(value: string) {
  return /^\d+$/.test(value) && Number(value) <= MAX_SCORE;
}

async function readError(response: Response): Promise<FormError> {
  if (response.status === 403) return { message: 'No tienes permisos para realizar esta acción.' };
  if (response.status === 404) return { message: 'Recurso no encontrado.' };
  if (response.status >= 500) return { message: 'El servidor no está disponible. Por favor, inténtalo más tarde.' };

  const payload = await response.json().catch(() => null);
  const message = typeof payload?.message === 'string' ? payload.message : undefined;
  if (response.status === 400) {
    const details = getApiData(payload);
    const fields: FormError['fields'] = {};
    for (const { name } of scoreFields) {
      const detail = details?.[name];
      if (typeof detail === 'string') fields[name] = detail;
    }
    return {
      message: payload?.errorCode === 'VALIDATION_ERROR' ? 'Datos de entrada inválidos.' : message ?? 'Datos de entrada inválidos.',
      fields,
    };
  }
  if (response.status === 409) return { message: message ?? 'Conflicto: El recurso ya existe.' };
  return { message: SAVE_ERROR };
}

export function ResultDialog({ match, onSaved }: { match: IMatchSummary; onSaved: () => void }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearUser = useUserStore((state) => state.clearUser);
  const [open, setOpen] = useState(false);
  const [scores, setScores] = useState({ homeScore: '', awayScore: '' });
  const [error, setError] = useState<FormError | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // A second submit can arrive before React paints the disabled button.
  const submitting = useRef(false);
  const valid = Object.values(scores).every(isValidScore);
  const title = match.resultLabel ? 'Editar resultado' : 'Registrar resultado';

  function handleOpenChange(nextOpen: boolean) {
    if (submitting.current) return;
    if (nextOpen) {
      setScores({
        homeScore: match.homeScore?.toString() ?? '',
        awayScore: match.awayScore?.toString() ?? '',
      });
      setError(null);
    }
    setOpen(nextOpen);
  }

  function expireSession() {
    clearUser();
    queryClient.removeQueries();
    navigate('/login?error=session', { replace: true });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !valid) return;
    const token = getSessionToken();
    if (!token) {
      expireSession();
      return;
    }

    submitting.current = true;
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(rosterApiUrl(`/matches/${match.id}/result/`), {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeScore: Number(scores.homeScore), awayScore: Number(scores.awayScore) }),
      });
      if (getSessionToken() !== token) return;
      if (response.status === 401) {
        expireSession();
      } else if (!response.ok) {
        setError(await readError(response));
      } else {
        setOpen(false);
        toast.success('Resultado guardado exitosamente');
        onSaved();
        void queryClient.invalidateQueries({ queryKey: ['reports'] });
      }
    } catch {
      setError({ message: SAVE_ERROR });
    } finally {
      submitting.current = false;
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="flex items-center gap-1">
          <ClipboardCheck className="h-4 w-4" />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>Guarda el marcador final para actualizar la tabla de posiciones.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-sm text-red-600" role="alert">{error.message}</p>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {scoreFields.map(({ name, label, team }) => {
              const id = `${name}-${match.id}`;
              const fieldError = error?.fields?.[name];
              return (
                <div className="space-y-2" key={name}>
                  <div>
                    <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
                    <p className="text-sm text-muted-foreground">{match[team]}</p>
                  </div>
                  <Input
                    id={id}
                    name={name}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={MAX_SCORE}
                    step={1}
                    required
                    value={scores[name]}
                    disabled={isSaving}
                    aria-invalid={Boolean(fieldError)}
                    aria-describedby={fieldError ? `${id}-error` : undefined}
                    onChange={(event) => setScores({ ...scores, [name]: event.target.value })}
                  />
                  {fieldError && <p id={`${id}-error`} className="text-xs text-red-600">{fieldError}</p>}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isSaving} onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!valid || isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar resultado'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
