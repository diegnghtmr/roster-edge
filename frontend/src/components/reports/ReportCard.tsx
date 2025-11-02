import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  category: string;
}

const categoryColors: Record<string, string> = {
  team: "bg-blue-100 text-blue-800 border-blue-200",
  season: "bg-green-100 text-green-800 border-green-200",
  performance: "bg-purple-100 text-purple-800 border-purple-200",
  staff: "bg-orange-100 text-orange-800 border-orange-200",
};

export const ReportCard = ({ title, description, icon, path, category }: ReportCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-lg ${categoryColors[category] || "bg-gray-100"}`}>
            {icon}
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            {category}
          </span>
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="ghost" className="w-full justify-between">
          <Link to={path}>
            Ver reporte
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
