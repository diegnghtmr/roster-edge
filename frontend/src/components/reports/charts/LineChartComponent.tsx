import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { REPORT_COLORS } from '@/constants/reportColors';

interface LineChartComponentProps {
  data: Record<string, string | number>[];
  xKey: string;
  lines: { key: string; name: string; color: string }[];
  height?: number;
  yAxisLabel?: string;
  xAxisLabel?: string;
}

export const LineChartComponent = ({
  data,
  xKey,
  lines,
  height = 400,
  yAxisLabel,
  xAxisLabel,
}: LineChartComponentProps) => {
  // Custom tooltip in Spanish
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{ color: string; name: string; value: number }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border-2 border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold text-gray-900 mb-2 text-base">{label}</p>
          {payload.map((entry, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <p className="text-sm font-medium text-gray-700">
                {entry.name}: <span className="font-bold">{entry.value}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={REPORT_COLORS.neutral.gray200}
          vertical={false}
        />
        <XAxis
          dataKey={xKey}
          tick={{ fill: REPORT_COLORS.neutral.gray600, fontSize: 12 }}
          tickLine={{ stroke: REPORT_COLORS.neutral.gray400 }}
          axisLine={{ stroke: REPORT_COLORS.neutral.gray400, strokeWidth: 1.5 }}
          label={
            xAxisLabel
              ? {
                  value: xAxisLabel,
                  position: 'insideBottom',
                  offset: -10,
                  style: { fill: REPORT_COLORS.neutral.gray700, fontWeight: 600 },
                }
              : undefined
          }
        />
        <YAxis
          tick={{ fill: REPORT_COLORS.neutral.gray600, fontSize: 12 }}
          tickLine={{ stroke: REPORT_COLORS.neutral.gray400 }}
          axisLine={{ stroke: REPORT_COLORS.neutral.gray400, strokeWidth: 1.5 }}
          label={
            yAxisLabel
              ? {
                  value: yAxisLabel,
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: REPORT_COLORS.neutral.gray700, fontWeight: 600 },
                }
              : undefined
          }
          domain={[0, 'auto']}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: REPORT_COLORS.neutral.gray300, strokeWidth: 2 }}
        />
        <Legend
          wrapperStyle={{
            paddingTop: '20px',
            fontSize: '14px',
          }}
          iconType="line"
          iconSize={20}
        />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            name={line.name}
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2, fill: line.color, stroke: REPORT_COLORS.neutral.white }}
            activeDot={{
              r: 7,
              strokeWidth: 2,
              fill: line.color,
              stroke: REPORT_COLORS.neutral.white,
            }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
