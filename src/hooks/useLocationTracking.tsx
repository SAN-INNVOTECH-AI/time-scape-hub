import { useState, useEffect, useRef } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  locationName?: string;
  address?: string;
}

export function useLocationTracking() {
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);
  const watchIdRef = useRef<string | null>(null);

  const requestPermissions = async () => {
    try {
      const permissions = await Geolocation.requestPermissions();
      return permissions.location === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  };

  const startTracking = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start tracking.",
        variant: "destructive",
      });
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      toast({
        title: "Permission denied",
        description: "Location access is required for tracking.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Start watching position
      watchIdRef.current = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000, // 30 seconds
        },
        (position: Position | null, err) => {
          if (err) {
            console.error('Location tracking error:', err);
            toast({
              title: "Location error",
              description: "Failed to get location. Please check your permissions.",
              variant: "destructive",
            });
            return;
          }

          if (position && position.coords) {
            const locationData: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy || 0,
              timestamp: new Date(position.timestamp),
            };

            setCurrentLocation(locationData);
            saveLocationToDatabase(locationData);
          }
        }
      );

      setIsTracking(true);
      toast({
        title: "Tracking started",
        description: "Your location is now being tracked.",
      });
    } catch (error) {
      console.error('Failed to start location tracking:', error);
      toast({
        title: "Tracking failed",
        description: "Could not start location tracking.",
        variant: "destructive",
      });
    }
  };

  const stopTracking = async () => {
    if (watchIdRef.current) {
      try {
        await Geolocation.clearWatch({ id: watchIdRef.current });
        watchIdRef.current = null;
        setIsTracking(false);
        toast({
          title: "Tracking stopped",
          description: "Location tracking has been paused.",
        });
      } catch (error) {
        console.error('Failed to stop location tracking:', error);
      }
    }
  };

  const saveLocationToDatabase = async (location: LocationData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_locations')
        .insert({
          user_id: user.id,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          location_name: location.locationName,
          address: location.address,
          timestamp: location.timestamp.toISOString(),
        });

      if (error) {
        console.error('Failed to save location:', error);
      }
    } catch (error) {
      console.error('Database error:', error);
    }
  };

  const fetchLocationHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Failed to fetch location history:', error);
        return;
      }

      if (data) {
        const locations = data.map(location => ({
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy || 0,
          timestamp: new Date(location.timestamp),
          locationName: location.location_name,
          address: location.address,
        }));
        setLocationHistory(locations);
      }
    } catch (error) {
      console.error('Error fetching location history:', error);
    }
  };

  useEffect(() => {
    if (user && isTracking) {
      fetchLocationHistory();
    }
  }, [user, isTracking]);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        Geolocation.clearWatch({ id: watchIdRef.current });
      }
    };
  }, []);

  return {
    isTracking,
    currentLocation,
    locationHistory,
    startTracking,
    stopTracking,
    fetchLocationHistory,
  };
}