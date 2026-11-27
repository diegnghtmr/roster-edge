import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ExportButton } from '@/components/reports/ExportButton';
import { toast } from 'sonner';

const download = vi.fn();
const createObjectURL = vi.fn(() => 'blob:report-pdf');
const revokeObjectURL = vi.fn();

beforeEach(() => {
  localStorage.setItem('token', 'report-session');
  vi.stubEnv('VITE_BACKEND_URL', 'http://localhost/api');
  vi.stubGlobal('URL', class extends URL {
    static createObjectURL = createObjectURL;
    static revokeObjectURL = revokeObjectURL;
  });
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    download(this.download, this.getAttribute('href'));
  });
});

afterEach(() => {
  localStorage.removeItem('token');
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

it('downloads the server PDF using the applied report filters and session, on click only', async () => {
  let finish: (response: Response) => void = () => {};
  const promise = new Promise<Response>((resolve) => { finish = resolve; });
  const fetchMock = vi.fn(() => promise);
  vi.stubGlobal('fetch', fetchMock);

  const { rerender } = render(<ExportButton report="season-standings" filters={{ seasonId: 7 }} disabled />);
  const button = screen.getByRole('button', { name: 'Exportar PDF' });
  expect(button).toBeDisabled();
  fireEvent.click(button);
  expect(fetchMock).not.toHaveBeenCalled();

  rerender(<ExportButton report="season-standings" filters={{ seasonId: 7 }} />);
  expect(button).toBeEnabled();
  expect(fetchMock).not.toHaveBeenCalled();
  fireEvent.click(button);

  expect(button).toBeDisabled();
  fireEvent.click(button);
  expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
    'http://localhost/api/analytics/reports/season-standings/pdf/?seasonId=7',
    expect.objectContaining({ method: 'GET', headers: expect.objectContaining({ Authorization: 'Bearer report-session' }) }),
  );
  expect(download).not.toHaveBeenCalled();

  finish(new Response('%PDF-1.7', { headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="tabla-posiciones.pdf"',
  } }));
  await waitFor(() => expect(download).toHaveBeenCalledExactlyOnceWith('tabla-posiciones.pdf', 'blob:report-pdf'));
  expect(createObjectURL).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ type: 'application/pdf' }));
  expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:report-pdf');
  expect(button).toBeEnabled();
});

it('shows an error and re-enables export without creating a download if the request fails', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 500 })));
  const errorToast = vi.spyOn(toast, 'error').mockImplementation(() => 'error-toast');
  vi.spyOn(console, 'error').mockImplementation(() => {});

  render(<ExportButton report="roster-profile" filters={{}} />);
  const button = screen.getByRole('button', { name: 'Exportar PDF' });
  fireEvent.click(button);

  await waitFor(() => expect(errorToast).toHaveBeenCalledWith('Error al generar el PDF'));
  expect(button).toBeEnabled();
  expect(download).not.toHaveBeenCalled();
  expect(createObjectURL).not.toHaveBeenCalled();
});
