import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useUserStore, { fetchSessionProfile, getApiData, rosterApiUrl } from '../../storage/storeUser';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';

interface LoginProps {
  getReturnDestination: (state: unknown) => string;
}

const Login = ({ getReturnDestination }: LoginProps) => {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(rosterApiUrl('/roster/login/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        if (response.status === 0 || response.status >= 500) {
          throw new Error('El servidor no está disponible. Por favor, inténtalo más tarde.');
        } else if (response.status === 401) {
          toast.error('Credenciales incorrectas. Verifica tu email y contraseña.');
          throw new Error('Credenciales incorrectas');
        } else if (response.status === 404) {
          throw new Error('Usuario no encontrado.');
        } else if (response.status === 400) {
          throw new Error('Datos de entrada inválidos.');
        }
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const token = getApiData(await response.json())?.token;
      if (typeof token !== 'string' || !token.trim()) {
        toast.error('Error en el inicio de sesión. Por favor, intenta nuevamente.');
        setError('Error en el inicio de sesión. Por favor, intenta nuevamente.');
        return;
      }

      const profile = await fetchSessionProfile(token);
      setUser(profile, token);
      void navigate(getReturnDestination(location.state), { replace: true });
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('El servidor no está disponible. Por favor, inténtalo más tarde.');
        setError('Error de conexión');
      } else if (error instanceof Error) {
        if (error.message.includes('El servidor no está disponible')) {
          toast.error(error.message);
          setError('Error de conexión');
        } else {
          setError(error.message || 'Login failed');
        }
      } else {
        setError('Error en el inicio de sesión. Por favor, intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-col min-h-screen flex items-center justify-center bg-gray-50">
      <div className="mb-8">
        <img className="mx-auto h-full w-[200px]" src={`${import.meta.env.BASE_URL}roster-logo.webp`} alt="Logo" />
      </div>
      <div className="w-[350px] space-y-8 p-8 bg-white rounded-lg shadow">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electronico
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Ingrese su correo electronico"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Ingrese su contraseña"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="text-gray-700 text-[14px] text-left">
              <i>{error}</i>
            </div>
          )}

          <Button type="submit" className="w-full bg-red-400" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
