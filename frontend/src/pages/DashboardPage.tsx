import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Calendar, Users, Trophy, Activity } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Teams',
      value: '3',
      icon: <Users className="h-8 w-8 text-blue-600" />,
      description: 'Active teams',
    },
    {
      title: 'Upcoming Games',
      value: '5',
      icon: <Calendar className="h-8 w-8 text-green-600" />,
      description: 'Next 30 days',
    },
    {
      title: 'Win Rate',
      value: '67%',
      icon: <Trophy className="h-8 w-8 text-yellow-600" />,
      description: 'This season',
    },
    {
      title: 'Active Players',
      value: '42',
      icon: <Activity className="h-8 w-8 text-purple-600" />,
      description: 'Across all teams',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName || user?.username}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your teams and recent activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>{stat.title}</CardDescription>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Games</CardTitle>
            <CardDescription>Your teams' latest results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((game) => (
                <div key={game} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">Team Alpha vs Team Beta</p>
                    <p className="text-sm text-gray-500">March {game}, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">W 3-2</p>
                    <p className="text-sm text-gray-500">Home</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Next games for your teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((game) => (
                <div key={game} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">Team Alpha vs Team Delta</p>
                    <p className="text-sm text-gray-500">March {10 + game}, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{2 + game}:00 PM</p>
                    <p className="text-sm text-gray-500">Away</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
