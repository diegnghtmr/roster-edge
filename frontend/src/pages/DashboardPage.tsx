import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { teamService, playerService, matchService } from '../services';
import type { Team, Match } from '../services';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    teams: 0,
    players: 0,
    upcomingMatches: 0,
    completedMatches: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentTeams, setRecentTeams] = useState<Team[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch teams
        const teams = await teamService.getAll();
        setRecentTeams(teams.slice(0, 5));
        
        // Fetch all matches
        const matches = await matchService.getAll();
        const upcoming = matches.filter(m => m.status === 'SCHEDULED');
        const completed = matches.filter(m => m.status === 'COMPLETED');
        setUpcomingMatches(upcoming.slice(0, 5));
        
        // Fetch players
        const players = await playerService.getAll();
        
        setStats({
          teams: teams.length,
          players: players.length,
          upcomingMatches: upcoming.length,
          completedMatches: completed.length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.fullName || user?.username}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teams}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.players}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Upcoming Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingMatches}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedMatches}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Teams */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Teams</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTeams.length > 0 ? (
            <div className="space-y-3">
              {recentTeams.map((team) => (
                <div key={team.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{team.name}</div>
                    <div className="text-sm text-gray-600">{team.sport}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Founded {team.foundedYear}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No teams available</p>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Matches</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingMatches.length > 0 ? (
            <div className="space-y-3">
              {upcomingMatches.map((match) => (
                <div key={match.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">
                      Team {match.homeTeamId} vs Team {match.awayTeamId}
                    </div>
                    <div className="text-sm text-gray-600">{match.venue}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(match.matchDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming matches</p>
          )}
        </CardContent>
      </Card>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Username:</span>
              <span className="font-medium">{user?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium capitalize">{user?.role?.toLowerCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user?.status}
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
