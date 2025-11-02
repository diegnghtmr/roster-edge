import { BarChart3, Calendar, TrendingUp, Users, Trophy, Activity, Zap, Target } from "lucide-react";
import type { ReportMetadata } from "@/interface/IReports";

export const reportsData: ReportMetadata[] = [
  {
    id: "season-standings",
    name: "Tabla de Posiciones",
    description: "Clasificación de equipos por temporada con estadísticas de rendimiento",
    category: "season",
    icon: "Trophy",
    endpoint: "/reports/season-standings",
  },
  {
    id: "roster-profile",
    name: "Perfil de Plantilla",
    description: "Análisis demográfico y físico de jugadores por equipo",
    category: "team",
    icon: "Users",
    endpoint: "/reports/roster-profile",
  },
  {
    id: "scoring-ranking",
    name: "Ranking de Goleadores",
    description: "Estadísticas de goles a favor y en contra por equipo",
    category: "performance",
    icon: "Target",
    endpoint: "/reports/scoring-ranking",
  },
  {
    id: "points-progress",
    name: "Progreso de Puntos",
    description: "Evolución de puntos acumulados a lo largo de la temporada",
    category: "performance",
    icon: "TrendingUp",
    endpoint: "/reports/points-progress",
  },
  {
    id: "match-load",
    name: "Carga de Partidos",
    description: "Distribución de partidos de local y visitante por equipo",
    category: "season",
    icon: "Activity",
    endpoint: "/reports/match-load",
  },
  {
    id: "staff-ratio",
    name: "Ratio Personal-Jugadores",
    description: "Proporción de staff técnico por jugador en cada equipo",
    category: "staff",
    icon: "Users",
    endpoint: "/reports/staff-ratio",
  },
  {
    id: "staff-impact",
    name: "Impacto del Personal",
    description: "Correlación entre personal técnico y rendimiento del equipo",
    category: "staff",
    icon: "Zap",
    endpoint: "/reports/staff-impact",
  },
  {
    id: "season-agenda",
    name: "Agenda de Temporada",
    description: "Calendario de eventos y partidos programados",
    category: "season",
    icon: "Calendar",
    endpoint: "/reports/season-agenda",
  },
  {
    id: "category-participation",
    name: "Participación por Categoría",
    description: "Análisis de participación por categoría y género",
    category: "team",
    icon: "BarChart3",
    endpoint: "/reports/category-participation",
  },
  {
    id: "schedule-density",
    name: "Densidad del Calendario",
    description: "Análisis de congestion de partidos y días de descanso",
    category: "season",
    icon: "Calendar",
    endpoint: "/reports/schedule-density",
  },
];

export const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    Trophy,
    Users,
    Target,
    TrendingUp,
    Activity,
    Zap,
    Calendar,
    BarChart3,
  };
  return icons[iconName] || BarChart3;
};
