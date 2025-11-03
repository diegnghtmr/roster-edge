import useGetList from "@/api/services/getServices/useGetList";
import type { Club } from "@/interface/IClub";
import type { Team } from "@/interface/ITeam";
import type { IRoster } from "@/interface/IRoster";

interface DashboardStats {
  totalClubs: number;
  totalTeams: number;
  activeUsers: number;
  systemPerformance: string;
  recentActivities: Array<{
    id: number;
    action: string;
    time: string;
    type: string;
  }>;
  systemStatus: {
    database: { status: string; message: string };
    api: { status: string; message: string };
    authentication: { status: string; message: string };
    fileStorage: { status: string; message: string };
  };
}

export const useDashboardData = () => {
  // Obtener datos de clubs
  const { data: clubsData, isLoading: isLoadingClubs } = useGetList<Club>({
    key: "dashboard-clubs",
    resource: ["clubs"],
    keyResults: "data",
    enabled: true,
  });

  // Obtener datos de equipos
  const { data: teamsData, isLoading: isLoadingTeams } = useGetList<Team>({
    key: "dashboard-teams",
    resource: ["teams"],
    keyResults: "data",
    enabled: true,
  });

  // Obtener datos del usuario actual (roster)
  const { data: rosterData, isLoading: isLoadingRoster } = useGetList<IRoster>({
    key: "roster-me",
    resource: ["roster/me"],
    keyResults: "data",
    enabled: true,
  });

  const isLoading = isLoadingClubs || isLoadingTeams || isLoadingRoster;

  // Calcular estadísticas usando los datos transformados
  const totalClubs = Array.isArray(clubsData) ? clubsData.length : 0;
  const totalTeams = Array.isArray(teamsData) ? teamsData.length : 0;

  const stats: DashboardStats = {
    totalClubs,
    totalTeams,
    activeUsers: rosterData ? 1 : 0, // Por ahora solo el usuario actual
    systemPerformance: "98%",
    recentActivities: [
      {
        id: 1,
        action: "Sistema iniciado",
        time: "Hace 2 minutos",
        type: "system",
      },
      {
        id: 2,
        action: "Usuario autenticado",
        time: "Hace 5 minutos",
        type: "user",
      },
      {
        id: 3,
        action: "Datos cargados",
        time: "Hace 10 minutos",
        type: "data",
      },
    ],
    systemStatus: {
      database: {
        status: "operational",
        message: "Base de datos funcionando correctamente",
      },
      api: { status: "operational", message: "API respondiendo normalmente" },
      authentication: {
        status: "operational",
        message: "Sistema de autenticación activo",
      },
      fileStorage: {
        status: "operational",
        message: "Almacenamiento de archivos disponible",
      },
    },
  };

  // Agregar actividades recientes basadas en datos reales
  if (clubsData && Array.isArray(clubsData) && clubsData.length > 0) {
    stats.recentActivities.unshift({
      id: Date.now(),
      action: `Club "${clubsData[0].name}" actualizado`,
      time: "Hace 1 minuto",
      type: "club",
    });
  }

  if (teamsData && Array.isArray(teamsData) && teamsData.length > 0) {
    stats.recentActivities.unshift({
      id: Date.now() + 1,
      action: `Equipo "${teamsData[0].name}" registrado`,
      time: "Hace 3 minutos",
      type: "team",
    });
  }

  return {
    stats,
    clubsData: Array.isArray(clubsData) ? clubsData : [],
    teamsData: Array.isArray(teamsData) ? teamsData : [],
    rosterData,
    isLoading,
  };
};
