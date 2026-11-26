import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ExportButton } from '@/components/reports/ExportButton';

const { initializeRenderer, renderPdf } = vi.hoisted(() => ({
  initializeRenderer: vi.fn(),
  renderPdf: vi.fn(() => ({ toBlob: async () => new Blob(['%PDF-1.7'], { type: 'application/pdf' }) })),
}));

vi.mock('@react-pdf/renderer', () => {
  initializeRenderer();
  return { pdf: renderPdf };
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('loads the template and PDF renderer only when export is requested and downloads the result', async () => {
  const pdfDocument = <span>Tabla de Posiciones</span>;
  const loadDocument = vi.fn(async () => pdfDocument);
  const createObjectURL = vi.fn(() => 'blob:report-pdf');
  const revokeObjectURL = vi.fn();
  vi.stubGlobal('URL', class extends URL {
    static createObjectURL = createObjectURL;
    static revokeObjectURL = revokeObjectURL;
  });
  const download = vi.fn();
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    download(this.download, this.getAttribute('href'));
  });

  const { rerender } = render(<ExportButton loadDocument={loadDocument} fileName="tabla-posiciones" disabled />);
  const button = screen.getByRole('button', { name: 'Exportar PDF' });
  expect(button).toBeDisabled();
  fireEvent.click(button);
  expect(initializeRenderer).not.toHaveBeenCalled();
  expect(loadDocument).not.toHaveBeenCalled();

  rerender(<ExportButton loadDocument={loadDocument} fileName="tabla-posiciones" />);
  expect(button).toBeEnabled();
  expect(initializeRenderer).not.toHaveBeenCalled();
  fireEvent.click(button);

  await waitFor(() => expect(download).toHaveBeenCalledExactlyOnceWith('tabla-posiciones.pdf', 'blob:report-pdf'));
  expect(initializeRenderer).toHaveBeenCalledTimes(1);
  expect(loadDocument).toHaveBeenCalledTimes(1);
  expect(renderPdf).toHaveBeenCalledExactlyOnceWith(pdfDocument);
  expect(createObjectURL).toHaveBeenCalledExactlyOnceWith(expect.any(Blob));
  expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:report-pdf');
});
