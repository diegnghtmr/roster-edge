import { useState, useMemo } from 'react';
import { InternalHeader } from '@/components/layout/InternalHeader';
import { ExportButton } from '@/components/reports/ExportButton';
import { ReportFilters, type FilterField } from '@/components/reports/ReportFilters';
import { StatCard } from '@/components/reports/StatCard';
import { BarChartComponent } from '@/components/reports/charts/BarChartComponent';
import { PieChartComponent } from '@/components/reports/charts/PieChartComponent';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import { CategoryParticipationPDF } from '@/components/reports/pdf/CategoryParticipationPDF';
import { useCategoryParticipationReport } from '@/api/services/reports/useReportsData';
import {
  useClubsForFilter,
  useSeasonsForFilter,
  useCategoriesForFilter,
  useGendersForFilter,
} from '@/api/services/filters/useFilterOptions';
import { translateGender } from '@/utils/translations';
import { ArrowLeft, BarChart3, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CategoryParticipationResponse } from '@/interface/IReports';

const tableHeaders: TableColumn[] = [
  { title: 'Club', key: 'clubName' },
  { title: 'Categoría', key: 'categoryName' },
  { title: 'Género', key: 'genderName', className: 'w-32' },
  { title: 'Partidos', key: 'matchesCount', className: 'w-24' },
  { title: '% Participación', key: 'participationPercentage', className: 'w-32' },
];

export const CategoryParticipationReport = () => {
  const [filters, setFilters] = useState<Record<string, string | number | boolean | undefined>>({});
  const [appliedFilters, setAppliedFilters] = useState<
    Record<string, string | number | boolean | undefined>
  >({});

  // Fetch filter options
  const { options: clubOptions, isLoading: clubsLoading } = useClubsForFilter();
  const { options: seasonOptions, isLoading: seasonsLoading } = useSeasonsForFilter(
    filters.clubId ? Number(filters.clubId) : undefined
  );
  const { options: categoryOptions, isLoading: categoriesLoading } = useCategoriesForFilter();
  const { options: genderOptions, isLoading: gendersLoading } = useGendersForFilter();

  // Dynamic filter fields with loaded options
  const filterFields: FilterField[] = useMemo(
    () => [
      {
        key: 'clubId',
        label: 'Club',
        type: 'select',
        options: clubOptions,
        placeholder: clubsLoading ? 'Cargando...' : 'Seleccionar club (opcional)',
      },
      {
        key: 'seasonId',
        label: 'Temporada',
        type: 'select',
        options: seasonOptions,
        placeholder: seasonsLoading ? 'Cargando...' : 'Seleccionar temporada (opcional)',
      },
      {
        key: 'categoryId',
        label: 'Categoría',
        type: 'select',
        options: categoryOptions,
        placeholder: categoriesLoading ? 'Cargando...' : 'Seleccionar categoría (opcional)',
      },
      {
        key: 'genderId',
        label: 'Género',
        type: 'select',
        options: genderOptions,
        placeholder: gendersLoading ? 'Cargando...' : 'Seleccionar género (opcional)',
      },
    ],
    [
      clubOptions,
      clubsLoading,
      seasonOptions,
      seasonsLoading,
      categoryOptions,
      categoriesLoading,
      genderOptions,
      gendersLoading,
    ]
  );

  const { data, isLoading } = useCategoryParticipationReport(appliedFilters, true);

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    if (key === 'clubId') {
      setFilters({ ...filters, clubId: value, seasonId: undefined });
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    setAppliedFilters({});
  };

  const handleApplyFilters = () => {
    const processedFilters: Record<string, string | number | boolean | undefined> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) return;
      if (key.endsWith('Id') && typeof value === 'string') {
        processedFilters[key] = Number(value);
      } else {
        processedFilters[key] = value;
      }
    });
    setAppliedFilters(processedFilters);
  };

  const participation = (data || []) as CategoryParticipationResponse[];

  // Calculate stats
  const totalMatches = participation.reduce((sum, item) => sum + (item.matchesCount || 0), 0);
  const categories = new Set(participation.map((item) => item.categoryName)).size;
  const genders = new Set(participation.map((item) => item.genderName)).size;

  // Chart data
  const categoryChart = participation.reduce(
    (acc, item) => {
      const existing = acc.find((x) => x.name === item.categoryName);
      if (existing) {
        existing.partidos += item.matchesCount || 0;
      } else {
        acc.push({ name: item.categoryName || 'Sin categoría', partidos: item.matchesCount || 0 });
      }
      return acc;
    },
    [] as { name: string; partidos: number }[]
  );

  const genderChart = participation.reduce(
    (acc, item) => {
      const translatedGender = translateGender(item.genderName);
      const existing = acc.find((x) => x.name === translatedGender);
      if (existing) {
        existing.value += item.matchesCount || 0;
      } else {
        acc.push({ name: translatedGender, value: item.matchesCount || 0 });
      }
      return acc;
    },
    [] as { name: string; value: number }[]
  );

  const renderRow = (item: CategoryParticipationResponse) => {
    const keyParts = [
      item.categoryId ?? 'category',
      item.genderId ?? 'gender',
      item.clubId ?? 'club',
      item.seasonId ?? 'season',
    ];

    return (
      <tr key={keyParts.join('-')}>
        <td className="px-4 py-3 font-medium">{item.clubName}</td>
        <td className="px-4 py-3 text-gray-700">{item.categoryName}</td>
        <td className="px-4 py-3">
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            {item.genderName}
          </span>
        </td>
        <td className="px-4 py-3 text-center font-semibold text-blue-600">
          {item.matchesCount || 0}
        </td>
        <td className="px-4 py-3 text-center font-semibold text-green-600">
          {item.participationPercentage ? `${item.participationPercentage.toFixed(1)}%` : '0.0%'}
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full">
      <InternalHeader
        title="Participación por Categoría"
        description="Análisis de participación por categoría y género"
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
            title="Total de Partidos"
            value={totalMatches}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <StatCard
            title="Categorías"
            value={categories}
            subtitle="categorías diferentes"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            title="Géneros"
            value={genders}
            subtitle="géneros representados"
            icon={<Users className="h-5 w-5" />}
          />
        </div>

        <div className="flex justify-end">
          <ExportButton
            document={<CategoryParticipationPDF data={participation} />}
            fileName={`participacion-categoria-${new Date().toISOString().split('T')[0]}`}
            disabled={participation.length === 0}
          />
        </div>

        {!isLoading && participation.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Partidos por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChartComponent
                  data={categoryChart}
                  xKey="name"
                  bars={[{ key: 'partidos', name: 'Partidos', color: '#3b82f6' }]}
                  yAxisLabel="Número de Partidos"
                  height={400}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por Género</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChartComponent
                  data={genderChart}
                  nameKey="name"
                  valueKey="value"
                  colors={['#3b82f6', '#ec4899', '#8b5cf6']}
                />
              </CardContent>
            </Card>
          </div>
        )}

        <div className="overflow-x-auto">
          <DataTable
            data={participation}
            headers={tableHeaders}
            renderRow={renderRow}
            loading={isLoading}
            emptyMessage="No se encontraron datos para los filtros seleccionados"
          />
        </div>
      </div>
    </div>
  );
};
