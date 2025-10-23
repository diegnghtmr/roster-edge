import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Clock, Phone, MessageCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";

const Support = () => {
  const [activeTab, setActiveTab] = useState("issues");

  const commonIssues = [
    {
      id: 1,
      title: "No puedo iniciar sesión",
      description: "Problemas con el acceso a la plataforma",
      severity: "high",
      solution: "Verifica tu conexión a internet y asegúrate de usar las credenciales correctas. Si el problema persiste, restablece tu contraseña.",
      status: "resolved"
    },
    {
      id: 2,
      title: "Error al crear equipos",
      description: "No se pueden guardar nuevos equipos",
      severity: "medium",
      solution: "Revisa que todos los campos obligatorios estén completos. Verifica que el nombre del equipo no esté duplicado.",
      status: "resolved"
    },
    {
      id: 3,
      title: "Problemas con reportes",
      description: "Los reportes no se generan correctamente",
      severity: "low",
      solution: "Asegúrate de tener datos suficientes para generar el reporte. Intenta recargar la página y generar el reporte nuevamente.",
      status: "open"
    },
    {
      id: 4,
      title: "Lentitud en la plataforma",
      description: "La aplicación responde lentamente",
      severity: "medium",
      solution: "Verifica tu conexión a internet. Limpia el caché del navegador. Si el problema persiste, contacta al soporte.",
      status: "resolved"
    }
  ];

  const supportChannels = [
    {
      title: "Chat en Vivo",
      description: "Soporte inmediato por chat",
      icon: MessageCircle,
      availability: "Disponible",
      responseTime: "2-5 minutos",
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Llamada Telefónica",
      description: "Atención personalizada por teléfono",
      icon: Phone,
      availability: "Disponible",
      responseTime: "Inmediato",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Correo Electrónico",
      description: "Soporte por email",
      icon: MessageCircle,
      availability: "24/7",
      responseTime: "4-8 horas",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  const systemStatus = {
    database: { status: "operational", message: "Base de datos funcionando correctamente" },
    api: { status: "operational", message: "API respondiendo normalmente" },
    authentication: { status: "operational", message: "Sistema de autenticación activo" },
    fileStorage: { status: "degraded", message: "Almacenamiento de archivos con latencia" }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "text-green-500";
      case "degraded": return "text-yellow-500";
      case "outage": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "degraded": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "outage": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Soporte Técnico</h1>
        <p className="text-muted-foreground">
          Asistencia técnica especializada para resolver problemas con la plataforma
        </p>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-red-500" />
            Estado del Sistema
          </CardTitle>
          <CardDescription>
            Monitoreo en tiempo real de los servicios de Roster Edge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(systemStatus).map(([key, service]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-sm text-muted-foreground">{service.message}</p>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(service.status)}
                  <span className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                    {service.status === "operational" ? "Operativo" :
                     service.status === "degraded" ? "Degradado" : "Inactivo"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("issues")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "issues"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Problemas Comunes
          </button>
          <button
            onClick={() => setActiveTab("channels")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "channels"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Canales de Soporte
          </button>
          <button
            onClick={() => setActiveTab("status")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "status"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Estado de Incidentes
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "issues" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Problemas y Soluciones</h2>
          <div className="grid gap-4">
            {commonIssues.map((issue) => (
              <Card key={issue.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{issue.title}</h3>
                        <Badge
                          variant={issue.severity === "high" ? "destructive" :
                                  issue.severity === "medium" ? "outline" : "secondary"}
                        >
                          {issue.severity === "high" ? "Alta" :
                           issue.severity === "medium" ? "Media" : "Baja"}
                        </Badge>
                        <Badge variant={issue.status === "resolved" ? "default" : "outline"}>
                          {issue.status === "resolved" ? "Resuelto" : "Abierto"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-700">Solución:</p>
                        <p className="text-sm text-gray-600 mt-1">{issue.solution}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "channels" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Canales de Atención</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {supportChannels.map((channel, index) => (
              <Card key={index} className={`border ${channel.borderColor}`}>
                <CardHeader className={`${channel.bgColor} pb-4`}>
                  <div className="flex items-center justify-between">
                    <channel.icon className={`h-6 w-6 ${channel.color}`} />
                    <Badge variant="secondary">{channel.availability}</Badge>
                  </div>
                  <CardTitle className="text-lg">{channel.title}</CardTitle>
                  <CardDescription>{channel.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tiempo de respuesta:</span>
                    <span className="text-sm font-medium">{channel.responseTime}</span>
                  </div>
                  <Button className="w-full bg-red-500 hover:bg-red-600">
                    Contactar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "status" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Incidentes Activos</h2>
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="text-lg font-semibold">Sin incidentes activos</h3>
                <p className="text-muted-foreground">
                  Todos los sistemas están funcionando correctamente. No hay incidentes reportados en este momento.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Incidentes</CardTitle>
              <CardDescription>Últimos problemas reportados y solucionados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Mantenimiento programado</p>
                    <p className="text-sm text-muted-foreground">Actualización de base de datos</p>
                  </div>
                  <Badge variant="default">Completado</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Problema de autenticación</p>
                    <p className="text-sm text-muted-foreground">Error temporal en el login</p>
                  </div>
                  <Badge variant="default">Resuelto</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Emergency Contact */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Contacto de Emergencia</CardTitle>
          <CardDescription className="text-red-600">
            Para problemas críticos que afecten el funcionamiento de tu organización
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-700">Soporte 24/7</p>
              <p className="text-sm text-red-600">+1 (555) 911-HELP</p>
            </div>
            <Button variant="destructive">
              <Phone className="h-4 w-4 mr-2" />
              Llamar Ahora
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
