import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { REPORT_COLORS } from "@/constants/reportColors";

interface BarChartComponentProps {
  data: Record<string, string | number>[];
  xKey: string;
  bars: { key: string; name: string; color: string }[];
  height?: number;
  yAxisLabel?: string;
  xAxisLabel?: string;
}

export const BarChartComponent = ({
  data,
  xKey,
  bars,
  height = 400,
  yAxisLabel,
  xAxisLabel
}: BarChartComponentProps) => {
  // Custom tick component to handle long labels with rotation
  interface AxisTickProps {
    x: number;
    y: number;
    payload: { value: string };
  }

  const CustomizedAxisTick = (props: AxisTickProps) => {
    const { x, y, payload } = props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          fontSize={12}
          transform="rotate(-35)"
        >
          {payload.value.length > 15
            ? `${payload.value.substring(0, 15)}...`
            : payload.value}
        </text>
      </g>
    );
  };

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
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
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
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={REPORT_COLORS.neutral.gray200}
          vertical={false}
        />
        <XAxis
          dataKey={xKey}
          tick={<CustomizedAxisTick />}
          tickLine={{ stroke: REPORT_COLORS.neutral.gray400 }}
          axisLine={{ stroke: REPORT_COLORS.neutral.gray400, strokeWidth: 1.5 }}
          interval={0}
          height={80}
          label={xAxisLabel ? {
            value: xAxisLabel,
            position: 'insideBottom',
            offset: -60,
            style: { fill: REPORT_COLORS.neutral.gray700, fontWeight: 600 }
          } : undefined}
        />
        <YAxis
          tick={{ fill: REPORT_COLORS.neutral.gray600, fontSize: 12 }}
          tickLine={{ stroke: REPORT_COLORS.neutral.gray400 }}
          axisLine={{ stroke: REPORT_COLORS.neutral.gray400, strokeWidth: 1.5 }}
          label={yAxisLabel ? {
            value: yAxisLabel,
            angle: -90,
            position: 'insideLeft',
            style: { fill: REPORT_COLORS.neutral.gray700, fontWeight: 600 }
          } : undefined}
          domain={[0, 'auto']}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: REPORT_COLORS.neutral.gray100 }} />
        <Legend
          wrapperStyle={{
            paddingTop: '20px',
            fontSize: '14px'
          }}
          iconType="rect"
          iconSize={12}
        />
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            fill={bar.color}
            name={bar.name}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
