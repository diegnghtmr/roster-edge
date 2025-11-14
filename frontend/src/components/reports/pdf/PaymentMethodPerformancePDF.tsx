import { PDFDocument, PDFSection, PDFStatCards, PDFTable, PDFBarChart, PDFPieChart } from "./PDFDocument";
import type { PaymentMethodPerformanceResponse } from "@/interface/IReports";

interface PaymentMethodPerformancePDFProps {
  data: PaymentMethodPerformanceResponse[];
}

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const formatCurrency = (value?: number) => currencyFormatter.format(value ?? 0);
const formatPercent = (value?: number) => `${(value ?? 0).toFixed(1)}%`;
const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("es-CO");
};

export const PaymentMethodPerformancePDF = ({ data }: PaymentMethodPerformancePDFProps) => {
  const totalNetRevenue = data.reduce((sum, item) => sum + (item.netRevenue ?? 0), 0);
  const totalPayments = data.reduce((sum, item) => sum + (item.totalPayments ?? 0), 0);
  const totalDiscount = data.reduce((sum, item) => sum + (item.totalDiscount ?? 0), 0);
  const averageTicket = totalPayments > 0 ? totalNetRevenue / totalPayments : 0;
  const topMethod = data.reduce<PaymentMethodPerformanceResponse | undefined>((best, current) => {
    if (!best) {
      return current;
    }
    const bestValue = best.netRevenue ?? 0;
    const currentValue = current.netRevenue ?? 0;
    return currentValue > bestValue ? current : best;
  }, undefined);

  const stats = [
    { label: "Ingresos netos", value: formatCurrency(totalNetRevenue) },
    { label: "Pagos procesados", value: totalPayments },
    { label: "Ticket promedio", value: formatCurrency(averageTicket) },
  ];

  const barChartData = data.map((item) => ({
    name: item.paymentMethodName ?? "Metodo",
    value: Number(item.netRevenue ?? 0),
  }));

  const pieChartData = data
    .filter((item) => (item.revenueSharePercentage ?? 0) > 0)
    .map((item) => ({
      name: item.paymentMethodName ?? "Metodo",
      value: Number(item.revenueSharePercentage ?? 0),
    }));

  const tableHeaders = [
    "Metodo",
    "Pagos",
    "Clientes",
    "Planes",
    "Ingresos netos",
    "Ticket",
    "% Revenue",
    "% Descuento",
    "Ultimo pago",
  ];
  const tableData = data.map((item) => [
    item.paymentMethodName ?? "-",
    item.totalPayments ?? 0,
    item.uniqueCustomers ?? 0,
    item.plansCovered ?? 0,
    formatCurrency(item.netRevenue ?? 0),
    formatCurrency(item.averageTicket ?? 0),
    formatPercent(item.revenueSharePercentage),
    formatPercent(item.discountRatePercentage),
    formatDate(item.lastPaymentDate),
  ]);

  return (
    <PDFDocument
      title="Rendimiento por Metodo de Pago"
      subtitle={
        topMethod
          ? `Top: ${topMethod.paymentMethodName ?? "-"} (${formatPercent(topMethod.revenueSharePercentage)})`
          : "Resumen de comportamientos por metodo de pago"
      }
    >
      <PDFSection title="Resumen General">
        <PDFStatCards stats={stats} />
      </PDFSection>

      <PDFSection title="Ingresos netos por metodo">
        <PDFBarChart data={barChartData} title="Ingresos netos" height={200} />
      </PDFSection>

      {pieChartData.length > 0 && (
        <PDFSection title="Participacion en ingresos">
          <PDFPieChart data={pieChartData} height={180} />
        </PDFSection>
      )}

      <PDFSection title="Detalle completo">
        <PDFTable headers={tableHeaders} data={tableData} />
      </PDFSection>

      <PDFSection title="Indicadores adicionales">
        <PDFStatCards
          stats={[
            { label: "Descuentos aplicados", value: formatCurrency(totalDiscount) },
            {
              label: "Metodo lider",
              value: topMethod
                ? `${topMethod.paymentMethodName} (${formatPercent(topMethod.revenueSharePercentage)})`
                : "-",
            },
            {
              label: "Clientes unicos",
              value: data.reduce((sum, item) => sum + (item.uniqueCustomers ?? 0), 0),
            },
          ]}
        />
      </PDFSection>
    </PDFDocument>
  );
};

