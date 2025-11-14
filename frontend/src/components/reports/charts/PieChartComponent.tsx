import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CHART_PALETTES, REPORT_COLORS } from '@/constants/reportColors';

interface PieChartComponentProps {
  data: Record<string, string | number>[];
  nameKey: string;
  valueKey: string;
  colors?: string[];
  height?: number;
  showLabel?: boolean;
  innerRadius?: number;
  minLabelPercentage?: number;
}

const DEFAULT_COLORS = CHART_PALETTES.default;
const RADIAN = Math.PI / 180;

interface CustomPieLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  name?: string;
}

interface CustomPieLineProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  percent?: number;
}

const createLabelRenderer = (minLabelPercentage: number) => (props: CustomPieLabelProps) => {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
    name = '',
  } = props;

  const percentage = percent * 100;

  if (!name || Number.isNaN(percentage) || percentage < minLabelPercentage) {
    return null;
  }

  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={REPORT_COLORS.neutral.gray800}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="middle"
      fontSize={12}
      fontWeight={600}
    >
      {`${name}: ${percentage.toFixed(1)}%`}
    </text>
  );
};

const createLabelLineRenderer = (minLabelPercentage: number) => (props: CustomPieLineProps) => {
  const { cx = 0, cy = 0, midAngle = 0, outerRadius = 0, percent = 0 } = props;

  const percentage = percent * 100;

  if (Number.isNaN(percentage) || percentage < minLabelPercentage) {
    return null;
  }

  const startRadius = outerRadius;
  const endRadius = outerRadius * 1.15;

  const startX = cx + startRadius * Math.cos(-midAngle * RADIAN);
  const startY = cy + startRadius * Math.sin(-midAngle * RADIAN);
  const endX = cx + endRadius * Math.cos(-midAngle * RADIAN);
  const endY = cy + endRadius * Math.sin(-midAngle * RADIAN);

  return (
    <path
      d={`M${startX},${startY}L${endX},${endY}`}
      stroke={REPORT_COLORS.neutral.gray400}
      strokeWidth={1.5}
      fill="none"
    />
  );
};

export const PieChartComponent = ({
  data,
  nameKey,
  valueKey,
  colors = DEFAULT_COLORS,
  height = 400,
  showLabel = true,
  innerRadius = 0,
  minLabelPercentage = 5,
}: PieChartComponentProps) => {
  const renderCustomLabel = createLabelRenderer(minLabelPercentage);
  const renderCustomLabelLine = createLabelLineRenderer(minLabelPercentage);

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
        <div className="bg-white p-4 border-2 border-gray-200 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: payload[0].payload.fill }}
            />
            <p className="font-bold text-gray-900">{payload[0].name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">
              Valor: <span className="font-bold">{payload[0].value}</span>
            </p>
            <p className="text-sm font-medium text-gray-700">
              Porcentaje: <span className="font-bold">{percent}%</span>
            </p>
          </div>
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
          labelLine={showLabel ? renderCustomLabelLine : false}
          label={showLabel ? renderCustomLabel : false}
          outerRadius={120}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey={valueKey}
          nameKey={nameKey}
          strokeWidth={2}
          stroke="#fff"
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => <span className="text-sm font-medium">{value}</span>}
          iconType="circle"
          iconSize={10}
          wrapperStyle={{
            paddingTop: '20px',
            fontSize: '14px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
