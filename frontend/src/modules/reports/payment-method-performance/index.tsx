import { useMemo, useState } from 'react';
import { InternalHeader } from '@/components/layout/InternalHeader';
import { ReportFilters, type FilterField } from '@/components/reports/ReportFilters';
import { StatCard } from '@/components/reports/StatCard';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import { ExportButton } from '@/components/reports/ExportButton';
import { BarChartComponent } from '@/components/reports/charts/BarChartComponent';
import { PieChartComponent } from '@/components/reports/charts/PieChartComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, DollarSign, PieChart, Receipt } from 'lucide-react';
import { usePaymentMethodPerformanceReport } from '@/api/services/reports/useReportsData';
import { usePlansForFilter, useCurrenciesForFilter } from '@/api/services/filters/useFilterOptions';
import type { PaymentMethodPerformanceResponse } from '@/interface/IReports';
import { PaymentMethodPerformancePDF } from '@/components/reports/pdf/PaymentMethodPerformancePDF';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const formatCurrency = (value?: number) => currencyFormatter.format(value ?? 0);
const formatPercent = (value?: number) => `${(value ?? 0).toFixed(1)}%`;

const tableHeaders: TableColumn[] = [
  { title: 'Metodo', key: 'paymentMethodName' },
  { title: 'Pagos', key: 'totalPayments', className: 'w-24 text-right' },
  { title: 'Clientes', key: 'uniqueCustomers', className: 'w-24 text-right' },
  { title: 'Planes', key: 'plansCovered', className: 'w-24 text-right' },
  { title: 'Ingresos netos', key: 'netRevenue', className: 'w-36 text-right' },
  { title: 'Ticket', key: 'averageTicket', className: 'w-36 text-right' },
  { title: '% Revenue', key: 'revenueSharePercentage', className: 'w-28 text-right' },
  { title: '% Descuento', key: 'discountRatePercentage', className: 'w-28 text-right' },
  { title: 'Ultimo pago', key: 'lastPaymentDate', className: 'w-36 text-right' },
];

export const PaymentMethodPerformanceReport = () => {
  const [filters, setFilters] = useState<Record<string, string | number | boolean | undefined>>({});
  const [appliedFilters, setAppliedFilters] = useState<
    Record<string, string | number | boolean | undefined>
  >({});

  const { options: planOptions, isLoading: plansLoading } = usePlansForFilter();
  const { options: currencyOptions, isLoading: currenciesLoading } = useCurrenciesForFilter();

  const filterFields: FilterField[] = useMemo(
    () => [
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
        key: 'planId',
        label: 'Plan',
        type: 'select',
        options: planOptions,
        placeholder: plansLoading ? 'Cargando...' : 'Seleccionar plan (opcional)',
      },
      {
        key: 'currencyId',
        label: 'Moneda',
        type: 'select',
        options: currencyOptions,
        placeholder: currenciesLoading ? 'Cargando...' : 'Seleccionar moneda (opcional)',
      },
    ],
    [planOptions, plansLoading, currencyOptions, currenciesLoading]
  );

  const { data, isLoading } = usePaymentMethodPerformanceReport(appliedFilters, true);
  const performance = (data || []) as PaymentMethodPerformanceResponse[];

  const totalNetRevenue = performance.reduce((sum, item) => sum + (item.netRevenue ?? 0), 0);
  const totalPayments = performance.reduce((sum, item) => sum + (item.totalPayments ?? 0), 0);
  const totalCustomers = performance.reduce((sum, item) => sum + (item.uniqueCustomers ?? 0), 0);
  const averageTicket = totalPayments > 0 ? totalNetRevenue / totalPayments : 0;
  const topMethod = performance.reduce<PaymentMethodPerformanceResponse | undefined>(
    (best, current) => {
      if (!best) {
        return current;
      }
      const bestValue = best.netRevenue ?? 0;
      const currentValue = current.netRevenue ?? 0;
      return currentValue > bestValue ? current : best;
    },
    undefined
  );

  const barChartData = performance.map((item) => ({
    name: item.paymentMethodName ?? 'Metodo',
    ingresos: Number(item.netRevenue ?? 0),
    descuentos: Number(item.totalDiscount ?? 0),
  }));

  const pieChartData = performance
    .filter((item) => (item.revenueSharePercentage ?? 0) > 0)
    .map((item) => ({
      name: item.paymentMethodName ?? 'Metodo',
      value: Number(item.revenueSharePercentage ?? 0),
    }));

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const processed: Record<string, string | number | boolean | undefined> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        return;
      }
      if (key.endsWith('Id') && typeof value === 'string') {
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

  const renderRow = (item: PaymentMethodPerformanceResponse) => {
    const lastPayment = item.lastPaymentDate ? new Date(item.lastPaymentDate) : null;
    return (
      <tr key={item.paymentMethodId ?? item.paymentMethodName ?? Math.random()}>
        <td className="px-4 py-3 font-medium">{item.paymentMethodName ?? '-'}</td>
        <td className="px-4 py-3 text-right">{item.totalPayments ?? 0}</td>
        <td className="px-4 py-3 text-right">{item.uniqueCustomers ?? 0}</td>
        <td className="px-4 py-3 text-right">{item.plansCovered ?? 0}</td>
        <td className="px-4 py-3 text-right font-semibold text-emerald-600">
          {formatCurrency(item.netRevenue ?? 0)}
        </td>
        <td className="px-4 py-3 text-right">{formatCurrency(item.averageTicket ?? 0)}</td>
        <td className="px-4 py-3 text-right">{formatPercent(item.revenueSharePercentage)}</td>
        <td className="px-4 py-3 text-right">{formatPercent(item.discountRatePercentage)}</td>
        <td className="px-4 py-3 text-right">
          {lastPayment ? lastPayment.toLocaleDateString('es-CO') : '-'}
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full">
      <InternalHeader
        title="Rendimiento por Metodo de Pago"
        description="Monitorea la participacion y rentabilidad de cada metodo de pago"
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
            title="Ingresos netos"
            value={formatCurrency(totalNetRevenue)}
            subtitle={`Ticket promedio: ${formatCurrency(averageTicket)}`}
            icon={<DollarSign className="h-5 w-5" />}
          />
          <StatCard
            title="Pagos procesados"
            value={totalPayments}
            subtitle={`Clientes unicos: ${totalCustomers}`}
            icon={<Receipt className="h-5 w-5" />}
          />
          <StatCard
            title="Metodo lider"
            value={topMethod?.paymentMethodName ?? '-'}
            subtitle={topMethod ? formatPercent(topMethod.revenueSharePercentage) : 'Sin datos'}
            icon={<PieChart className="h-5 w-5" />}
          />
        </div>

        <div className="flex justify-end">
          <ExportButton
            document={<PaymentMethodPerformancePDF data={performance} />}
            fileName="reporte-metodos-pago"
            disabled={performance.length === 0}
          />
        </div>

        {!isLoading && performance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ingresos por metodo</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={barChartData}
                xKey="name"
                bars={[
                  { key: 'ingresos', name: 'Ingresos netos', color: '#16a34a' },
                  { key: 'descuentos', name: 'Descuentos', color: '#f97316' },
                ]}
                yAxisLabel="Valor (COP)"
                height={380}
              />
            </CardContent>
          </Card>
        )}

        {!isLoading && pieChartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Participacion por ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChartComponent data={pieChartData} height={320} />
            </CardContent>
          </Card>
        )}

        <div className="overflow-x-auto">
          <DataTable
            data={performance}
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

export default PaymentMethodPerformanceReport;
