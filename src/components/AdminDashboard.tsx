import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import CreateUserForm from "./CreateUserForm";
import { Users, MapPin, Clock, Activity, Eye, Download, Calendar } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  currentLocation?: string;
  timeSpent?: string;
  lastActive?: string;
  isActive: boolean;
}

interface LocationStats {
  totalUsers: number;
  activeUsers: number;
  totalLocations: number;
  avgDailyTime: string;
}

export default function AdminDashboard() {
  const { user, userRole, signOut } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<LocationStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalLocations: 0,
    avgDailyTime: "0h"
  });
  const [recentLocations, setRecentLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      const usersWithActivity = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Get latest location for each user
          const { data: latestLocation } = await supabase
            .from('user_locations')
            .select('*')
            .eq('user_id', profile.id)
            .order('timestamp', { ascending: false })
            .limit(1);

          const location = latestLocation?.[0];
          const lastActive = location ? new Date(location.timestamp) : new Date(profile.created_at);
          const isActive = location ? 
            (new Date().getTime() - new Date(location.timestamp).getTime()) < 30 * 60 * 1000 : // Active if location within 30 minutes
            false;

          const timeSpent = location ? await calculateTimeSpent(profile.id) : '0m';

          return {
            id: profile.id,
            name: profile.full_name || profile.email,
            email: profile.email,
            currentLocation: location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'No location',
            timeSpent,
            lastActive: formatRelativeTime(lastActive),
            isActive
          };
        })
      );

      setUsers(usersWithActivity);
      
      // Calculate stats
      const activeCount = usersWithActivity.filter(u => u.isActive).length;
      setStats({
        totalUsers: usersWithActivity.length,
        activeUsers: activeCount,
        totalLocations: 0, // Will be calculated from locations
        avgDailyTime: "7.2h"
      });

    } catch (error) {
      console.error('Error in fetchUsers:', error);
    }
  };

  const fetchRecentLocations = async () => {
    try {
      const { data: locations, error } = await supabase
        .from('user_locations')
        .select(`
          *,
          profiles!inner(full_name, email)
        `)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching locations:', error);
        return;
      }

      setRecentLocations(locations || []);
      
      // Update total locations count
      const { count } = await supabase
        .from('user_locations')
        .select('*', { count: 'exact', head: true });
        
      setStats(prev => ({ ...prev, totalLocations: count || 0 }));
      
    } catch (error) {
      console.error('Error in fetchRecentLocations:', error);
    }
  };

  const calculateTimeSpent = async (userId: string) => {
    // Simple calculation - could be enhanced with proper time tracking logic
    const today = new Date().toDateString();
    const { data } = await supabase
      .from('user_locations')
      .select('timestamp')
      .eq('user_id', userId)
      .gte('timestamp', new Date(today).toISOString());

    if (!data || data.length === 0) return '0m';
    
    const hours = Math.floor(data.length / 60); // Rough estimation
    const minutes = data.length % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatRelativeTime = (date: Date) => {
    const diff = new Date().getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    if (user && userRole === 'admin') {
      fetchUsers();
      fetchRecentLocations();
      setIsLoading(false);

      // Set up realtime subscription for user locations
      const subscription = supabase
        .channel('admin-locations')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'user_locations'
          },
          () => {
            fetchUsers();
            fetchRecentLocations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user, userRole]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-glass rounded w-64"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-surface-glass rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statsData = [
    { label: "Total Users", value: stats.totalUsers.toString(), icon: Users, color: "text-blue-500" },
    { label: "Active Users", value: stats.activeUsers.toString(), icon: Users, color: "text-green-500" },
    { label: "Total Locations", value: stats.totalLocations.toString(), icon: MapPin, color: "text-purple-500" },
    { label: "Avg. Daily Time", value: stats.avgDailyTime, icon: Clock, color: "text-orange-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor user activity and locations in real-time</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="glass-surface border-border/50">
            <Calendar className="h-4 w-4 mr-2" />
            Live Data
          </Button>
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="glass-card p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create User Form */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CreateUserForm />
        </div>

        {/* Live Activity */}
        <div className="lg:col-span-2">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Live User Activity</h2>
                  <p className="text-sm text-muted-foreground">Real-time location and time tracking</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.id} className="glass-surface p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          {user.isActive && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{user.name}</h3>
                            <span className="text-xs text-muted-foreground">({user.email})</span>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-48">{user.currentLocation}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{user.timeSpent}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Last active</div>
                          <div className="text-sm font-medium">{user.lastActive}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No users found</p>
                  <p className="text-sm">Create users to start tracking</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Location Activity */}
      <Card className="glass-card p-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-primary" />
          Recent Location Updates
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentLocations.length > 0 ? (
            recentLocations.map((location, index) => (
              <div key={index} className="glass-surface p-3 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{location.profiles?.full_name || location.profiles?.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-primary">
                    {formatRelativeTime(new Date(location.timestamp))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ±{location.accuracy?.toFixed(0) || 0}m
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No location data yet</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}