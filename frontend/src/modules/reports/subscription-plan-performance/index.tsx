import { useMemo, useState } from 'react';
import { InternalHeader } from '@/components/layout/InternalHeader';
import { ReportFilters, type FilterField } from '@/components/reports/ReportFilters';
import { StatCard } from '@/components/reports/StatCard';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import { ExportButton } from '@/components/reports/ExportButton';
import { BarChartComponent } from '@/components/reports/charts/BarChartComponent';
import { PieChartComponent } from '@/components/reports/charts/PieChartComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, TrendingUp, DollarSign } from 'lucide-react';
import { useSubscriptionPlanPerformanceReport } from '@/api/services/reports/useReportsData';
import {
  usePlansForFilter,
  useSubscriptionStatusesForFilter,
} from '@/api/services/filters/useFilterOptions';
import type { SubscriptionPlanPerformanceResponse } from '@/interface/IReports';
import { SubscriptionPlanPerformancePDF } from '@/components/reports/pdf/SubscriptionPlanPerformancePDF';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const formatCurrency = (value?: number) => currencyFormatter.format(value ?? 0);
const formatPercent = (value?: number) => `${(value ?? 0).toFixed(1)}%`;

const tableHeaders: TableColumn[] = [
  { title: 'Plan', key: 'planName' },
  { title: 'Precio', key: 'planPrice', className: 'w-32 text-right' },
  { title: 'Suscripciones', key: 'totalSubscriptions', className: 'w-32 text-right' },
  { title: 'Activas', key: 'activeSubscriptions', className: 'w-24 text-right' },
  { title: 'Trial', key: 'trialSubscriptions', className: 'w-24 text-right' },
  { title: 'Suspendidas', key: 'suspendedSubscriptions', className: 'w-28 text-right' },
  { title: 'Inactivas', key: 'inactiveSubscriptions', className: 'w-28 text-right' },
  { title: 'Prox renov', key: 'upcomingRenewals', className: 'w-28 text-right' },
  { title: 'Churn rec', key: 'churnedRecently', className: 'w-28 text-right' },
  { title: 'Pagos', key: 'paymentsCount', className: 'w-20 text-right' },
  { title: 'Ingresos netos', key: 'netRevenue', className: 'w-36 text-right' },
  { title: 'ARPU', key: 'arpu', className: 'w-28 text-right' },
  { title: 'Retencion', key: 'retentionRatePercentage', className: 'w-24 text-right' },
];

export const SubscriptionPlanPerformanceReport = () => {
  const [filters, setFilters] = useState<Record<string, string | number | boolean | undefined>>({});
  const [appliedFilters, setAppliedFilters] = useState<
    Record<string, string | number | boolean | undefined>
  >({});

  const { options: planOptions, isLoading: plansLoading } = usePlansForFilter();
  const { options: statusOptions, isLoading: statusesLoading } = useSubscriptionStatusesForFilter();

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        key: 'planId',
        label: 'Plan',
        type: 'select',
        options: planOptions,
        placeholder: plansLoading ? 'Cargando...' : 'Seleccionar plan (opcional)',
      },
      {
        key: 'statusId',
        label: 'Estado',
        type: 'select',
        options: statusOptions,
        placeholder: statusesLoading ? 'Cargando...' : 'Seleccionar estado (opcional)',
      },
      {
        key: 'fromDate',
        label: 'Fecha desde',
        type: 'date',
        placeholder: 'YYYY-MM-DD',
      },
      {
        key: 'toDate',
        label: 'Fecha hasta',
        type: 'date',
        placeholder: 'YYYY-MM-DD',
      },
      {
        key: 'referenceDate',
        label: 'Fecha referencia',
        type: 'date',
        placeholder: 'YYYY-MM-DD',
      },
      {
        key: 'renewalHorizonDays',
        label: 'Horizonte renovaciones (dias)',
        type: 'number',
        placeholder: '45',
      },
      {
        key: 'churnWindowDays',
        label: 'Ventana churn (dias)',
        type: 'number',
        placeholder: '60',
      },
    ],
    [planOptions, plansLoading, statusOptions, statusesLoading]
  );

  const { data, isLoading } = useSubscriptionPlanPerformanceReport(appliedFilters, true);
  const plans = (data || []) as SubscriptionPlanPerformanceResponse[];

  const totalSubscriptions = plans.reduce((sum, plan) => sum + (plan.totalSubscriptions ?? 0), 0);
  const totalActive = plans.reduce((sum, plan) => sum + (plan.activeSubscriptions ?? 0), 0);
  const totalTrial = plans.reduce((sum, plan) => sum + (plan.trialSubscriptions ?? 0), 0);
  const totalSuspended = plans.reduce((sum, plan) => sum + (plan.suspendedSubscriptions ?? 0), 0);
  const totalInactive = plans.reduce((sum, plan) => sum + (plan.inactiveSubscriptions ?? 0), 0);
  const totalUpcoming = plans.reduce((sum, plan) => sum + (plan.upcomingRenewals ?? 0), 0);
  const totalNetRevenue = plans.reduce((sum, plan) => sum + (plan.netRevenue ?? 0), 0);
  const overallRetention = totalSubscriptions > 0 ? (totalActive / totalSubscriptions) * 100 : 0;

  const barChartData = plans.map((plan) => ({
    name: plan.planName ?? 'Plan',
    ingresos: Number(plan.netRevenue ?? 0),
  }));

  const pieChartData = [
    { name: 'Activas', value: totalActive },
    { name: 'Trials', value: totalTrial },
    { name: 'Suspendidas', value: totalSuspended },
    { name: 'Inactivas', value: totalInactive },
  ].filter((item) => item.value > 0);

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const processed: Record<string, string | number | boolean | undefined> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        return;
      }
      if ((key.endsWith('Id') || key.endsWith('Days')) && typeof value === 'string') {
        processed[key] = Number(value);
      } else {
        processed[key] = value;
      }
    });

    setAppliedFilters(processed);
  };

  const handleClearFilters = () => {
    setFilters({});
    setAppliedFilters({});
  };

  const renderRow = (plan: SubscriptionPlanPerformanceResponse) => (
    <tr key={plan.planId ?? plan.planName ?? Math.random()}>
      <td className="px-4 py-3 font-medium">{plan.planName ?? '-'}</td>
      <td className="px-4 py-3 text-right">{formatCurrency(plan.planPrice ?? 0)}</td>
      <td className="px-4 py-3 text-right">{plan.totalSubscriptions ?? 0}</td>
      <td className="px-4 py-3 text-right">{plan.activeSubscriptions ?? 0}</td>
      <td className="px-4 py-3 text-right">{plan.trialSubscriptions ?? 0}</td>
      <td className="px-4 py-3 text-right">{plan.suspendedSubscriptions ?? 0}</td>
      <td className="px-4 py-3 text-right">{plan.inactiveSubscriptions ?? 0}</td>
      <td className="px-4 py-3 text-right">{plan.upcomingRenewals ?? 0}</td>
      <td className="px-4 py-3 text-right">{plan.churnedRecently ?? 0}</td>
      <td className="px-4 py-3 text-right">{plan.paymentsCount ?? 0}</td>
      <td className="px-4 py-3 text-right text-emerald-600 font-semibold">
        {formatCurrency(plan.netRevenue ?? 0)}
      </td>
      <td className="px-4 py-3 text-right">{formatCurrency(plan.arpu ?? 0)}</td>
      <td className="px-4 py-3 text-right">{formatPercent(plan.retentionRatePercentage)}</td>
    </tr>
  );

  return (
    <div className="w-full">
      <InternalHeader
        title="Salud de Planes de Suscripcion"
        description="Evalua la adopcion, retencion y revenue de cada plan comercial"
        buttons={[
          {
            text: 'Volver',
            icon: <ArrowLeft className="h-4 w-4" />,
            link: '/reports',
            variant: 'outline',
          },
        ]}
      />

      <div className="bg-white w-full shadow-md rounded-lg min-h-screen p-6 space-y-6">
        <ReportFilters
          fields={filterFields}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Suscripciones activas"
            value={totalActive}
            subtitle={`Total suscripciones: ${totalSubscriptions}`}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Retencion global"
            value={formatPercent(overallRetention)}
            subtitle={`Trials activas: ${totalTrial}`}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            title="Ingresos netos"
            value={formatCurrency(totalNetRevenue)}
            subtitle={`Renovaciones proximas: ${totalUpcoming}`}
            icon={<DollarSign className="h-5 w-5" />}
          />
        </div>

        <div className="flex justify-end">
          <ExportButton
            document={<SubscriptionPlanPerformancePDF data={plans} />}
            fileName="reporte-planes-suscripcion"
            disabled={plans.length === 0}
          />
        </div>

        {!isLoading && plans.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ingresos netos por plan</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={barChartData}
                xKey="name"
                bars={[{ key: 'ingresos', name: 'Ingresos netos', color: '#2563eb' }]}
                yAxisLabel="Valor (COP)"
                height={380}
              />
            </CardContent>
          </Card>
        )}

        {!isLoading && pieChartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Distribucion de estados</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChartComponent data={pieChartData} height={320} />
            </CardContent>
          </Card>
        )}

        <div className="overflow-x-auto">
          <DataTable
            data={plans}
            headers={tableHeaders}
            renderRow={renderRow}
            loading={isLoading}
            emptyMessage="No se encontraron datos para los filtros seleccionados"
            showSearch={false}
          />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlanPerformanceReport;
