import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, vi } from 'vitest';

// Radix Select scrolls the focused option into view; jsdom has no layout.
HTMLElement.prototype.scrollIntoView ??= () => undefined;

export function mockApi(respond: (url: URL, init?: RequestInit) => Response) {
  vi.stubEnv('VITE_BACKEND_URL', 'http://localhost/api');
  const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) =>
    Promise.resolve(respond(new URL(String(input)), init))
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

export function apiData(data: unknown) {
  return Response.json({ success: true, data });
}

export function queryRouter(path = '/') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };
}

export function writeRequests(fetchMock: ReturnType<typeof mockApi>) {
  return fetchMock.mock.calls
    .filter(([, init]) => init?.method === 'POST' || init?.method === 'PUT')
    .map(([url, init]) => ({
      path: new URL(String(url)).pathname,
      method: init?.method,
      body: JSON.parse(String(init?.body)),
    }));
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
