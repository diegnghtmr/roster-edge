import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import useUserStore from "../../storage/storeUser";
import {
  Users,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  TrendingUp,
  Building,
  UsersRound,
  Eye,
} from "lucide-react";
import { useDashboardData } from "./useDashboardData";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useUserStore();
  const { stats, teamsData } = useDashboardData();

  const dashboardStats = [
    {
      title: "Clubs Registrados",
      value: stats.totalClubs.toString(),
      description: "Organizaciones deportivas",
      icon: Building,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      title: "Equipos Activos",
      value: stats.totalTeams.toString(),
      description: "Equipos en el sistema",
      icon: UsersRound,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      title: "Usuarios Activos",
      value: stats.activeUsers.toString(),
      description: "Usuarios conectados",
      icon: Users,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
    },
    {
      title: "Rendimiento",
      value: stats.systemPerformance,
      description: "Tiempo activo del sistema",
      icon: TrendingUp,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
    },
  ];

  const recentActivities = stats.recentActivities;
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenido de nuevo, {user?.name?.split(" ")[0] || "Usuario"}!
        </h1>
        <p className="text-muted-foreground">
          Resumen del estado actual de tu sistema de gestión deportiva.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <Card
            key={index}
            className={`border ${stat.borderColor} ${stat.bgColor}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas comunes y atajos</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Button className="h-20 flex-col gap-2 bg-red-500 hover:bg-red-600">
              <Plus className="h-6 w-6" />
              <span>Nuevo Club</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
            >
              <Calendar className="h-6 w-6 text-orange-500" />
              <span>Programar Evento</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
            >
              <BarChart3 className="h-6 w-6 text-rose-500" />
              <span>Ver Reportes</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 border-pink-200 hover:bg-pink-50 hover:border-pink-300"
            >
              <Settings className="h-6 w-6 text-pink-500" />
              <span>Configuración</span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas actividades del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "user"
                      ? "bg-red-500"
                      : activity.type === "team"
                        ? "bg-orange-500"
                        : activity.type === "system"
                          ? "bg-rose-500"
                          : activity.type === "club"
                            ? "bg-pink-500"
                            : "bg-blue-500"
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Equipos Recientes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Equipos Recientes</CardTitle>
              <CardDescription>
                Últimos equipos registrados en el sistema
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/teams")}
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            {teamsData && teamsData.length > 0 ? (
              <div className="space-y-3">
                {teamsData.slice(0, 3).map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <UsersRound className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{team.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {team.mascot || "Sin mascota"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={team.active ? "default" : "secondary"}>
                      {team.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <UsersRound className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No hay equipos registrados
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigate("/teams-create")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Equipo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Sistema</CardTitle>
          <CardDescription>
            Estado actual de salud y métricas de rendimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {Object.entries(stats.systemStatus).map(([key, service]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    service.status === "operational"
                      ? "bg-green-500"
                      : service.status === "degraded"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}:{" "}
                  {service.status === "operational"
                    ? "Operativo"
                    : service.status === "degraded"
                      ? "Degradado"
                      : "Inactivo"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
