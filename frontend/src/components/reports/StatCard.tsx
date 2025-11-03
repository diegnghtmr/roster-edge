import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
}

export const StatCard = ({ title, value, subtitle, trend, trendValue, icon }: StatCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "neutral":
        return <Minus className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "neutral":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {(subtitle || trend) && (
              <div className="flex items-center gap-2">
                {trend && getTrendIcon()}
                {trendValue && (
                  <span className={`text-sm font-medium ${getTrendColor()}`}>
                    {trendValue}
                  </span>
                )}
                {subtitle && (
                  <span className="text-sm text-gray-500">{subtitle}</span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
