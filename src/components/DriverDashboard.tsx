import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Bus, 
  Play, 
  Square, 
  Edit3, 
  Save, 
  LogOut, 
  MapPin,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import { ChatBot } from './ChatBot';

interface DriverDashboardProps {
  onLogout: () => void;
}

export function DriverDashboard({ onLogout }: DriverDashboardProps) {
  const [busNumber, setBusNumber] = useState('42A');
  const [isEditing, setIsEditing] = useState(false);
  const [tempBusNumber, setTempBusNumber] = useState(busNumber);
  const [tripActive, setTripActive] = useState(false);
  const [tripStartTime, setTripStartTime] = useState<Date | null>(null);
  const [gpsActive, setGpsActive] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('Main St & 5th Ave');

  // Simulate GPS tracking
  useEffect(() => {
    if (tripActive && gpsActive) {
      const locations = [
        'Main St & 5th Ave',
        'Oak Street Station', 
        'University Campus',
        'Shopping Center',
        'Hospital District',
        'Downtown Terminal'
      ];
      
      const interval = setInterval(() => {
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        setCurrentLocation(randomLocation);
      }, 15000); // Update location every 15 seconds

      return () => clearInterval(interval);
    }
  }, [tripActive, gpsActive]);

  // Simulate GPS connectivity
  useEffect(() => {
    const interval = setInterval(() => {
      setGpsActive(Math.random() > 0.05); // 95% uptime
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStartTrip = () => {
    setTripActive(true);
    setTripStartTime(new Date());
  };

  const handleEndTrip = () => {
    setTripActive(false);
    setTripStartTime(null);
  };

  const handleSaveBusNumber = () => {
    setBusNumber(tempBusNumber);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempBusNumber(busNumber);
    setIsEditing(false);
  };

  const formatTripDuration = () => {
    if (!tripStartTime) return '00:00:00';
    
    const now = new Date();
    const diff = now.getTime() - tripStartTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-2">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">BusTracker</h1>
                <div className="flex items-center space-x-1">
                  {gpsActive ? (
                    <Wifi className="w-3 h-3 text-green-500" />
                  ) : (
                    <WifiOff className="w-3 h-3 text-red-500" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {gpsActive ? 'GPS Active' : 'GPS Offline'}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Bus Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bus className="w-5 h-5" />
              <span>Bus Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bus Number Editor */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Bus Number:</label>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={tempBusNumber}
                    onChange={(e) => setTempBusNumber(e.target.value)}
                    className="h-12"
                    placeholder="Enter bus number"
                  />
                  <Button onClick={handleSaveBusNumber} className="h-12">
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit} className="h-12">
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <Badge variant="outline" className="text-xl px-4 py-2 bg-blue-50 text-blue-700 border-blue-200">
                    {busNumber}
                  </Badge>
                  <Button variant="ghost" onClick={() => setIsEditing(true)}>
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              )}
            </div>

            {/* Current Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Location:</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">{currentLocation}</span>
                  {gpsActive && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Live
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trip Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Trip Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!tripActive ? (
              <Button 
                onClick={handleStartTrip}
                className="w-full bg-green-600 hover:bg-green-700 h-16 text-lg"
                size="lg"
              >
                <Play className="w-6 h-6 mr-2" />
                Start Trip
              </Button>
            ) : (
              <Button 
                onClick={handleEndTrip}
                variant="destructive"
                className="w-full h-16 text-lg"
                size="lg"
              >
                <Square className="w-6 h-6 mr-2" />
                End Trip
              </Button>
            )}

            {tripActive && (
              <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 mb-2">Trip Active</p>
                <p className="text-3xl font-mono text-green-800">{formatTripDuration()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* GPS Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>GPS Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">GPS Tracking:</span>
              <Badge variant={gpsActive ? "default" : "secondary"} className={gpsActive ? "bg-green-500" : ""}>
                {gpsActive ? 'Active' : 'Offline'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Background Sync:</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Low Data Mode
              </Badge>
            </div>
            
            {tripActive && (
              <div className="text-xs text-muted-foreground p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="mb-1">📡 Sending location updates every 30 seconds</p>
                <p>📱 Optimized for minimal data usage</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* GPS Alert */}
        {!gpsActive && (
          <Alert>
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              GPS connection lost. Attempting to reconnect... Passengers will see schedule-based information.
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Play className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Start Trip</p>
                  <p className="text-xs text-muted-foreground">Press when beginning your route</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Edit3 className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Edit Bus Number</p>
                  <p className="text-xs text-muted-foreground">Only if needed for route changes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Square className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">End Trip</p>
                  <p className="text-xs text-muted-foreground">Press when completing your route</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multilingual Chatbot */}
      <ChatBot userRole="driver" />
    </div>
  );
}