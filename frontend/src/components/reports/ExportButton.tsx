import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { DocumentProps } from '@react-pdf/renderer';
import { toast } from 'sonner';

interface ExportButtonProps {
  loadDocument: () => Promise<React.ReactElement<DocumentProps>>;
  fileName: string;
  disabled?: boolean;
}

export const ExportButton = ({ loadDocument, fileName, disabled }: ExportButtonProps) => {
  const handleExport = async () => {
    try {
      toast.info('Generando PDF...');

      const [{ pdf }, pdfDocument] = await Promise.all([import('@react-pdf/renderer'), loadDocument()]);
      const blob = await pdf(pdfDocument).toBlob();
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${fileName}.pdf`;
      link.click();

      URL.revokeObjectURL(url);
      toast.success('PDF generado exitosamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    }
  };

  return (
    <Button onClick={handleExport} disabled={disabled} variant="outline" size="sm">
      <Download className="h-4 w-4" />
      Exportar PDF
    </Button>
  );
};
