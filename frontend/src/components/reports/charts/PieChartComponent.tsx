import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface PieChartComponentProps {
  data: Record<string, string | number>[];
  nameKey: string;
  valueKey: string;
  colors?: string[];
  height?: number;
  showLabel?: boolean;
  innerRadius?: number;
}

const DEFAULT_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

export const PieChartComponent = ({
  data,
  nameKey,
  valueKey,
  colors = DEFAULT_COLORS,
  height = 400,
  showLabel = true,
  innerRadius = 0,
}: PieChartComponentProps) => {
  // Custom label renderer in Spanish with percentage
  const renderCustomLabel = (entry: Record<string, string | number>) => {
    const total = data.reduce((sum, item) => sum + Number(item[valueKey]), 0);
    const percent = ((Number(entry[valueKey]) / total) * 100).toFixed(1);
    return `${entry[nameKey]}: ${percent}%`;
  };

  // Custom tooltip in Spanish
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: { fill: string } }>;
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const total = data.reduce((sum, item) => sum + Number(item[valueKey]), 0);
      const percent = ((Number(payload[0].value) / total) * 100).toFixed(1);

      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-md">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-sm" style={{ color: payload[0].payload.fill }}>
            Valor: {payload[0].value}
          </p>
          <p className="text-sm text-gray-600">
            Porcentaje: {percent}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={showLabel}
          label={showLabel ? renderCustomLabel : false}
          outerRadius={120}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey={valueKey}
          nameKey={nameKey}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => <span className="text-sm">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
