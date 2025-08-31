import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, Clock, Play, Pause, Navigation } from 'lucide-react';

export default function UserTracker() {
  const { user, signOut } = useAuth();
  const {
    isTracking,
    currentLocation,
    locationHistory,
    startTracking,
    stopTracking,
    fetchLocationHistory,
  } = useLocationTracking();

  useEffect(() => {
    if (user) {
      fetchLocationHistory();
    }
  }, [user]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const calculateTimeSpent = () => {
    if (!locationHistory.length) return '0 minutes';
    
    const today = new Date().toDateString();
    const todayLocations = locationHistory.filter(
      location => location.timestamp.toDateString() === today
    );
    
    if (todayLocations.length === 0) return '0 minutes';
    
    const firstLocation = todayLocations[todayLocations.length - 1];
    const lastLocation = todayLocations[0];
    const timeDiff = lastLocation.timestamp.getTime() - firstLocation.timestamp.getTime();
    const minutes = Math.floor(timeDiff / (1000 * 60));
    
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getLocationsVisitedToday = () => {
    if (!locationHistory.length) return 0;
    
    const today = new Date().toDateString();
    const todayLocations = locationHistory.filter(
      location => location.timestamp.toDateString() === today
    );
    
    // Group by approximate location (within ~100m)
    const uniqueLocations = new Set();
    todayLocations.forEach(location => {
      const key = `${Math.round(location.latitude * 1000)}_${Math.round(location.longitude * 1000)}`;
      uniqueLocations.add(key);
    });
    
    return uniqueLocations.size;
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Location Tracker</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          Sign Out
        </Button>
      </div>

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
            onClick={isTracking ? stopTracking : startTracking}
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
          
          {currentLocation ? (
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Location #{locationHistory.length + 1}</h4>
                <p className="text-sm text-muted-foreground">
                  {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                </p>
                {currentLocation.locationName && (
                  <p className="text-sm text-primary font-medium">{currentLocation.locationName}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">{formatTime(currentLocation.timestamp)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  ±{currentLocation.accuracy.toFixed(0)}m accuracy
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No location data yet</p>
            </div>
          )}
        </div>
      </Card>

      {/* Today's Summary */}
      <Card className="glass-card p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
              <Navigation className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Today's Activity</h3>
              <p className="text-sm text-muted-foreground">{formatDate(new Date())}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-surface p-3 rounded-xl text-center">
              <div className="text-2xl font-bold text-primary">{getLocationsVisitedToday()}</div>
              <div className="text-xs text-muted-foreground">Locations</div>
            </div>
            <div className="glass-surface p-3 rounded-xl text-center">
              <div className="text-2xl font-bold text-secondary">{calculateTimeSpent()}</div>
              <div className="text-xs text-muted-foreground">Total Time</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Locations */}
      <Card className="glass-card p-6">
        <h3 className="font-semibold mb-4">Recent Locations ({locationHistory.length})</h3>
        <div className="space-y-3">
          {locationHistory.length > 0 ? (
            locationHistory.slice(0, 5).map((location, index) => (
              <div key={index} className="glass-surface p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      Location #{locationHistory.length - index}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </p>
                    {location.locationName && (
                      <p className="text-xs text-primary font-medium">{location.locationName}</p>
                    )}
                  </div>
                  <div className="text-right ml-2">
                    <div className="text-sm font-medium">{formatTime(location.timestamp)}</div>
                    <div className="text-xs text-muted-foreground">±{location.accuracy.toFixed(0)}m</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Navigation className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No location history yet</p>
              <p className="text-xs">Start tracking to see your locations</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}