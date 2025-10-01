import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import useUserStore from "../../storage/storeUser";
import {
  Users,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useUserStore();

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      description: "+12% from last month",
      icon: Users,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      title: "Active Sessions",
      value: "89",
      description: "Currently online",
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      title: "Completed Tasks",
      value: "456",
      description: "+8% from last week",
      icon: CheckCircle,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
    },
    {
      title: "Performance",
      value: "94%",
      description: "System uptime",
      icon: TrendingUp,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New user registered",
      time: "2 minutes ago",
      type: "user",
    },
    { id: 2, action: "Task completed", time: "15 minutes ago", type: "task" },
    {
      id: 3,
      action: "System backup completed",
      time: "1 hour ago",
      type: "system",
    },
    {
      id: 4,
      action: "New feature deployed",
      time: "2 hours ago",
      type: "deployment",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0] || "User"}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your roster system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Button className="h-20 flex-col gap-2 bg-red-500 hover:bg-red-600">
              <Plus className="h-6 w-6" />
              <span>Add New User</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
            >
              <Calendar className="h-6 w-6 text-orange-500" />
              <span>Schedule Event</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
            >
              <BarChart3 className="h-6 w-6 text-rose-500" />
              <span>View Reports</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 border-pink-200 hover:bg-pink-50 hover:border-pink-300"
            >
              <Settings className="h-6 w-6 text-pink-500" />
              <span>System Settings</span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "user"
                      ? "bg-red-500"
                      : activity.type === "task"
                      ? "bg-orange-500"
                      : activity.type === "system"
                      ? "bg-rose-500"
                      : "bg-pink-500"
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
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current system health and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Database: Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm">API: Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
              <span className="text-sm">Cache: Warming up</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
