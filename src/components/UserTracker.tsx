import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Play, Pause, Activity, Zap } from "lucide-react";

interface LocationData {
  name: string;
  address: string;
  timeSpent: string;
  isActive: boolean;
}

export default function UserTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData>({
    name: "Coffee Shop Downtown",
    address: "123 Main Street, City Center",
    timeSpent: "2h 15m",
    isActive: true,
  });

  const [recentLocations] = useState<LocationData[]>([
    {
      name: "Home Office",
      address: "456 Oak Avenue",
      timeSpent: "6h 30m",
      isActive: false,
    },
    {
      name: "Client Meeting - TechCorp",
      address: "789 Business Blvd, Suite 200",
      timeSpent: "1h 45m",
      isActive: false,
    },
    {
      name: "Gym & Fitness",
      address: "321 Health Street",
      timeSpent: "1h 20m",
      isActive: false,
    },
  ]);

  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Status Card */}
      <Card className="glass-card p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium text-muted-foreground">
              {isTracking ? 'Location Tracking Active' : 'Tracking Paused'}
            </span>
          </div>
          
          <Button
            onClick={toggleTracking}
            className={`w-full h-16 text-lg font-medium rounded-2xl transition-all ${
              isTracking 
                ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
                : 'bg-gradient-primary hover:shadow-glow text-white'
            }`}
          >
            {isTracking ? (
              <>
                <Pause className="h-6 w-6 mr-2" />
                Stop Tracking
              </>
            ) : (
              <>
                <Play className="h-6 w-6 mr-2" />
                Start Tracking
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Current Location */}
      <Card className="glass-card p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Current Location</h3>
              <p className="text-sm text-muted-foreground">Real-time tracking</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">{currentLocation.name}</h4>
              <p className="text-sm text-muted-foreground">{currentLocation.address}</p>
            </div>
            
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">{currentLocation.timeSpent}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Active now</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Today's Summary */}
      <Card className="glass-card p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Today's Activity</h3>
              <p className="text-sm text-muted-foreground">December 31, 2024</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-surface p-3 rounded-xl text-center">
              <div className="text-2xl font-bold text-primary">8</div>
              <div className="text-xs text-muted-foreground">Locations</div>
            </div>
            <div className="glass-surface p-3 rounded-xl text-center">
              <div className="text-2xl font-bold text-secondary">11h 50m</div>
              <div className="text-xs text-muted-foreground">Total Time</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Locations */}
      <Card className="glass-card p-6">
        <h3 className="font-semibold mb-4">Recent Locations</h3>
        <div className="space-y-3">
          {recentLocations.map((location, index) => (
            <div key={index} className="glass-surface p-3 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{location.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{location.address}</p>
                </div>
                <div className="text-right ml-2">
                  <div className="text-sm font-medium">{location.timeSpent}</div>
                  <div className="text-xs text-muted-foreground">completed</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Setup Note */}
      <Card className="glass-card p-4 border-accent/50">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            🔐 Connect to Supabase to enable real location tracking, user authentication, and data storage.
          </p>
          <Button variant="outline" className="text-xs">
            Setup Backend
          </Button>
        </div>
      </Card>
    </div>
  );
}