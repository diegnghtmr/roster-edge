import { fetchReportPdf } from '@/api/services/reports/useReportsData';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ExportButtonProps {
  report: string;
  filters: Record<string, string | number | boolean | undefined>;
  disabled?: boolean;
}

export const ExportButton = ({ report, filters, disabled }: ExportButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      toast.info('Generando PDF...');
      const response = await fetchReportPdf(report, filters);
      const blob = await response.blob();
      if (blob.type !== 'application/pdf') {
        throw new Error('Expected a PDF response');
      }

      const disposition = response.headers.get('Content-Disposition');
      // The API uses fixed ASCII report slugs for attachment filenames.
      const filename = disposition?.match(/\bfilename="([a-z0-9-]+\.pdf)"/i)?.[1] ?? `${report}.pdf`;
      const url = URL.createObjectURL(blob);
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
      } finally {
        URL.revokeObjectURL(url);
      }
      toast.success('PDF generado exitosamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" onClick={handleExport} disabled={disabled || loading} aria-busy={loading} variant="outline" size="sm">
      <Download className="h-4 w-4" />
      Exportar PDF
    </Button>
  );
};
