import { toast } from 'sonner';

interface IParamsType {
  resource: string[] | undefined;
  params?: Record<string, string> | URLSearchParams | string;
}

export const fetchGet = async ({ resource, params }: IParamsType) => {
  const searchParams = new URLSearchParams(params);
  const cookies = localStorage.getItem('token');

  try {
    // Join resource array with slashes
    const resourcePath = Array.isArray(resource) ? resource.join('/') : resource;
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/${resourcePath}/?${searchParams}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookies}`,
          'Content-type': 'application/json',
        },
      }
    );

    // Check if the response is not ok (e.g., 404, 500)
    if (!response.ok) {
      // Handle server errors
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
      } else if (response.status === 400) {
        toast.error('Datos de entrada inválidos.');
        throw new Error('Datos de entrada inválidos.');
      } else if (response.status === 409) {
        toast.error('Conflicto: El recurso ya existe.');
        throw new Error('Conflicto: El recurso ya existe.');
      }
      throw new Error(`Error del servidor: ${response.status}`);
    }

    // Parse the JSON response
    return await response.json();
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      toast.error('El servidor no está disponible. Por favor, inténtalo más tarde.');
      throw new Error('El servidor no está disponible. Por favor, inténtalo más tarde.');
    }
    throw error;
  }
};
