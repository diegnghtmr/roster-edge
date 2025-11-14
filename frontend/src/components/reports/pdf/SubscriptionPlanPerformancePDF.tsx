import {
  PDFDocument,
  PDFSection,
  PDFStatCards,
  PDFTable,
  PDFBarChart,
  PDFPieChart,
} from './PDFDocument';
import type { SubscriptionPlanPerformanceResponse } from '@/interface/IReports';

interface SubscriptionPlanPerformancePDFProps {
  data: SubscriptionPlanPerformanceResponse[];
}

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const formatCurrency = (value?: number) => currencyFormatter.format(value ?? 0);
const formatPercent = (value?: number) => `${(value ?? 0).toFixed(1)}%`;

export const SubscriptionPlanPerformancePDF = ({ data }: SubscriptionPlanPerformancePDFProps) => {
  const totalSubscriptions = data.reduce((sum, plan) => sum + (plan.totalSubscriptions ?? 0), 0);
  const totalActive = data.reduce((sum, plan) => sum + (plan.activeSubscriptions ?? 0), 0);
  const totalTrial = data.reduce((sum, plan) => sum + (plan.trialSubscriptions ?? 0), 0);
  const totalSuspended = data.reduce((sum, plan) => sum + (plan.suspendedSubscriptions ?? 0), 0);
  const totalInactive = data.reduce((sum, plan) => sum + (plan.inactiveSubscriptions ?? 0), 0);
  const totalUpcoming = data.reduce((sum, plan) => sum + (plan.upcomingRenewals ?? 0), 0);
  const totalChurn = data.reduce((sum, plan) => sum + (plan.churnedRecently ?? 0), 0);
  const totalNetRevenue = data.reduce((sum, plan) => sum + (plan.netRevenue ?? 0), 0);
  const totalPayments = data.reduce((sum, plan) => sum + (plan.paymentsCount ?? 0), 0);

  const overallRetention = totalSubscriptions > 0 ? (totalActive / totalSubscriptions) * 100 : 0;
  const revenuePerPlan = data.length > 0 ? totalNetRevenue / data.length : 0;

  const stats = [
    { label: 'Suscripciones activas', value: totalActive },
    { label: 'Retencion global', value: formatPercent(overallRetention) },
    { label: 'Ingresos netos', value: formatCurrency(totalNetRevenue) },
  ];

  const barChartData = data.map((plan) => ({
    name: plan.planName ?? 'Plan',
    value: Number(plan.netRevenue ?? 0),
  }));

  const pieChartData = [
    { name: 'Activas', value: totalActive },
    { name: 'Trials', value: totalTrial },
    { name: 'Suspendidas', value: totalSuspended },
    { name: 'Inactivas', value: totalInactive },
  ].filter((item) => item.value > 0);

  const tableHeaders = [
    'Plan',
    'Precio',
    'Suscripciones',
    'Activas',
    'Trial',
    'Suspendidas',
    'Inactivas',
    'Prox renov',
    'Churn rec',
    'Pagos',
    'Ingresos netos',
    'ARPU',
    'Retencion',
  ];
  const tableData = data.map((plan) => [
    plan.planName ?? '-',
    formatCurrency(plan.planPrice ?? 0),
    plan.totalSubscriptions ?? 0,
    plan.activeSubscriptions ?? 0,
    plan.trialSubscriptions ?? 0,
    plan.suspendedSubscriptions ?? 0,
    plan.inactiveSubscriptions ?? 0,
    plan.upcomingRenewals ?? 0,
    plan.churnedRecently ?? 0,
    plan.paymentsCount ?? 0,
    formatCurrency(plan.netRevenue ?? 0),
    formatCurrency(plan.arpu ?? 0),
    formatPercent(plan.retentionRatePercentage),
  ]);

  return (
    <PDFDocument
      title="Salud de Planes de Suscripcion"
      subtitle={`Promedio por plan: ${formatCurrency(revenuePerPlan)} | Pagos registrados: ${totalPayments}`}
    >
      <PDFSection title="Resumen General">
        <PDFStatCards stats={stats} />
      </PDFSection>

      <PDFSection title="Ingresos por plan">
        <PDFBarChart data={barChartData} title="Ingresos netos" height={200} />
      </PDFSection>

      {pieChartData.length > 0 && (
        <PDFSection title="Distribucion de estados">
          <PDFPieChart data={pieChartData} height={180} />
        </PDFSection>
      )}

      <PDFSection title="Detalle completo">
        <PDFTable headers={tableHeaders} data={tableData} />
      </PDFSection>

      <PDFSection title="Alertas y renovaciones">
        <PDFStatCards
          stats={[
            { label: 'Renovaciones proximas', value: totalUpcoming },
            { label: 'Churn reciente', value: totalChurn },
            { label: 'Trials activas', value: totalTrial },
          ]}
        />
      </PDFSection>
    </PDFDocument>
  );
};
