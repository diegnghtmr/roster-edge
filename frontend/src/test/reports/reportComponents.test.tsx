import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PieProps } from 'recharts';
import { BarChartComponent } from '@/components/reports/charts/BarChartComponent';
import { PieChartComponent } from '@/components/reports/charts/PieChartComponent';
import { DataTable } from '@/components/table/DataTable';
import { ScheduleDensityReport } from '@/modules/reports/schedule-density';

vi.mock(import('recharts'), async (importOriginal) => {
  const recharts = await importOriginal();
  return {
    ...recharts,
    Pie: Object.assign(
      (props: PieProps) => <recharts.Pie {...props} isAnimationActive={false} />,
      { displayName: recharts.Pie.displayName }
    ),
  };
});

vi.mock('@/api/services/reports/useReportsData', () => ({
  useScheduleDensityReport: () => ({ data: [], isLoading: false }),
}));
vi.mock('@/api/services/filters/useFilterOptions', () => ({
  useSeasonsForFilter: () => ({ options: [], isLoading: false }),
  useTeamsForFilter: () => ({ options: [], isLoading: false }),
}));

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 600, 400));
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('report rendering', () => {
  it('passes each row a zero-based index for duplicate entries', () => {
    render(
      <DataTable
        data={['Club A', 'Club A']}
        headers={[{ title: 'Equipo', key: 'team' }]}
        renderRow={(item, index) => <tr key={index}><td>{index + 1}. {item}</td></tr>}
      />
    );
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('cell').map((cell) => cell.textContent)).toEqual([
      '1. Club A',
      '2. Club A',
    ]);
  });

  it('still supports row renderers that only receive the item', () => {
    render(
      <DataTable
        data={['Club A']}
        headers={[{ title: 'Equipo', key: 'team' }]}
        renderRow={(item) => <tr key={item}><td>{item}</td></tr>}
      />
    );
    expect(screen.getByRole('cell', { name: 'Club A' })).toBeVisible();
  });

  it('renders a pie from the report default name and value fields', async () => {
    const { container } = render(
      <PieChartComponent data={[{ name: 'Transfer', value: 97 }, { name: 'Cash', value: 3 }]} />
    );
    expect(await screen.findByText('Transfer: 97.0%')).toBeVisible();
    expect(screen.getByText('Cash')).toBeVisible();
    expect(screen.queryByText('Cash: 3.0%')).not.toBeInTheDocument();
    const sector = container.querySelector('[name="Transfer"].recharts-sector');
    expect(sector).not.toBeNull();
    fireEvent.mouseEnter(sector!);
    expect(await screen.findByText('97.0%', { exact: true })).toBeVisible();
  });

  it('honors explicit pie keys and still hides labels and lines when requested', async () => {
    const { container } = render(
      <PieChartComponent data={[{ caption: 'Card', amount: 12 }]} nameKey="caption" valueKey="amount" showLabel={false} />
    );
    expect(await screen.findByText('Card')).toBeVisible();
    expect(screen.queryByText('Card: 100.0%')).not.toBeInTheDocument();
    expect(container.querySelector('.recharts-pie-labels path')).not.toBeInTheDocument();
  });

  it('renders a numeric category and still truncates a long category label', async () => {
    render(
      <BarChartComponent
        data={[{ team: 2026, points: 2 }, { team: 'A very long club name', points: 3 }]}
        xKey="team"
        bars={[{ key: 'points', name: 'Puntos', color: '#3b82f6' }]}
      />
    );
    expect(await screen.findByText('2026')).toBeVisible();
    const longLabel = screen.getByText('A very long clu...');
    expect(longLabel).toHaveAttribute('transform', 'rotate(-35)');
  });

  it('describes schedule density and preserves the report index link', () => {
    render(<MemoryRouter><ScheduleDensityReport /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Reporte de Densidad del Calendario' })).toBeVisible();
    expect(screen.getByText('Distribución de partidos y días de descanso por equipo')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Volver' })).toHaveAttribute('href', '/reports');
  });
});
