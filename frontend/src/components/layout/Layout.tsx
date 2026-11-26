import { lazy, Suspense, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useUserStore from '../../storage/storeUser.ts';
import { Spinner } from '@/components/ui/spinner';

const AuthenticatedLayout = lazy(() => import('./AuthenticatedLayout'));

const loading = (
  <div className="flex min-h-screen items-center justify-center">
    <Spinner />
  </div>
);

export const Layout = () => {
  const status = useUserStore((state) => state.status);
  const restoreSession = useUserStore((state) => state.restoreSession);
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (status !== 'restoring') return;
    const controller = new AbortController();
    void restoreSession(controller.signal);
    return () => controller.abort();
  }, [status, restoreSession]);

  if (status === 'restoring') return loading;

  if (status === 'signed-out') {
    return <Navigate to="/login" replace state={{ returnTo: `${pathname}${search}${hash}` }} />;
  }

  return (
    <Suspense fallback={loading}>
      <AuthenticatedLayout />
    </Suspense>
  );
};
