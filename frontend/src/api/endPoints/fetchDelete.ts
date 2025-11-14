import { toast } from 'sonner';

interface IParamsType {
  id: string | number;
  resource: string[] | undefined;
}

export const fetchDelete = async ({ id, resource }: IParamsType) => {
  const cookies = localStorage.getItem('token');

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/${resource?.join('')}/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${cookies}`,
          'Content-type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // Handle HTTP errors
      if (response.status === 0 || response.status >= 500) {
        toast.error('El servidor no está disponible. Por favor, inténtalo más tarde.');
        throw new Error('El servidor no está disponible. Por favor, inténtalo más tarde.');
      } else if (response.status === 401) {
        // Clear user data and redirect to login
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login?error=session';
        throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
      } else if (response.status === 403) {
        toast.error('No tienes permisos para realizar esta acción.');
        throw new Error('No tienes permisos para realizar esta acción.');
      } else if (response.status === 404) {
        toast.error('Recurso no encontrado.');
        throw new Error('Recurso no encontrado.');
      } else if (response.status === 409) {
        toast.error('Conflicto: No se puede eliminar el recurso.');
        throw new Error('Conflicto: No se puede eliminar el recurso.');
      }
      throw new Error(`Error del servidor: ${response.status}`);
    }

    if (response.status === 204) return { data: {}, status: response.status };

    const data = (await response.json()) || true;
    return { data, status: response.status };
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      toast.error('El servidor no está disponible. Por favor, inténtalo más tarde.');
      throw new Error('El servidor no está disponible. Por favor, inténtalo más tarde.');
    }
    throw error;
  }
};
