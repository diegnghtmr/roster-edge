import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

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
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-md">
          <p className="font-semibold text-gray-800 mb-1">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey={xKey}
          tick={<CustomizedAxisTick />}
          tickLine={{ stroke: "#666" }}
          interval={0}
          height={80}
          label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -60 } : undefined}
        />
        <YAxis
          tick={{ fill: "#666" }}
          tickLine={{ stroke: "#666" }}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          domain={[0, 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        {bars.map((bar) => (
          <Bar key={bar.key} dataKey={bar.key} fill={bar.color} name={bar.name} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
