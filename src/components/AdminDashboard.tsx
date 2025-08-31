import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Clock, Activity, Eye, Download, Calendar } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  currentLocation: string;
  timeSpent: string;
  lastActive: string;
  isActive: boolean;
}

export default function AdminDashboard() {
  const users: UserData[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      currentLocation: "Coffee Shop Downtown",
      timeSpent: "2h 15m",
      lastActive: "2 min ago",
      isActive: true,
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike@company.com",
      currentLocation: "Client Office - TechCorp",
      timeSpent: "4h 30m",
      lastActive: "5 min ago",
      isActive: true,
    },
    {
      id: "3",
      name: "Emma Davis",
      email: "emma@company.com",
      currentLocation: "Home Office",
      timeSpent: "6h 45m",
      lastActive: "1 hour ago",
      isActive: false,
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      email: "alex@company.com",
      currentLocation: "Training Center",
      timeSpent: "3h 20m",
      lastActive: "15 min ago",
      isActive: true,
    },
  ];

  const stats = [
    { label: "Active Users", value: "3", icon: Users, color: "text-green-500" },
    { label: "Total Locations", value: "12", icon: MapPin, color: "text-blue-500" },
    { label: "Avg. Daily Time", value: "7.2h", icon: Clock, color: "text-purple-500" },
    { label: "Weekly Activity", value: "94%", icon: Activity, color: "text-orange-500" },
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
            This Week
          </Button>
          <Button variant="outline" className="glass-surface border-border/50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <stat.icon className={`h-6 w-6 text-white`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Live Activity */}
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

        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="glass-surface p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
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
                  <Button size="sm" variant="ghost" className="hover:bg-surface-hover">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            Top Locations This Week
          </h3>
          <div className="space-y-3">
            {[
              { name: "Home Office", time: "24h 30m", users: 8 },
              { name: "Coffee Shop Downtown", time: "18h 45m", users: 6 },
              { name: "Client Office - TechCorp", time: "12h 15m", users: 4 },
              { name: "Co-working Space", time: "9h 20m", users: 3 },
            ].map((location, index) => (
              <div key={index} className="glass-surface p-3 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{location.name}</div>
                  <div className="text-xs text-muted-foreground">{location.users} users</div>
                </div>
                <div className="text-sm font-medium text-primary">{location.time}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-secondary" />
            User Performance
          </h3>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="glass-surface p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {user.name.split(' ')[0][0]}
                    </span>
                  </div>
                  <span className="font-medium text-sm">{user.name.split(' ')[0]}</span>
                </div>
                <div className="text-sm font-medium text-accent">{user.timeSpent}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Setup Note */}
      <Card className="glass-card p-6 border-accent/50">
        <div className="text-center space-y-3">
          <h3 className="font-semibold text-lg">Ready for Real Data?</h3>
          <p className="text-muted-foreground">
            Connect to Supabase to enable live user tracking, authentication, location data storage, and advanced reporting features.
          </p>
          <Button className="bg-gradient-primary hover:shadow-glow text-white">
            Connect Supabase Backend
          </Button>
        </div>
      </Card>
    </div>
  );
}