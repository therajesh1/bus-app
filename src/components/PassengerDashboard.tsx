import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bus, 
  MapPin, 
  Search, 
  Bell, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  CloudRain, 
  AlertTriangle,
  Calendar,
  Users,
  LogOut,
  Wifi,
  WifiOff
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChatBot } from './ChatBot';

interface PassengerDashboardProps {
  onLogout: () => void;
}

interface Bus {
  id: string;
  number: string;
  route: string;
  currentLocation: string;
  eta: number;
  isLive: boolean;
  lastUpdated: string;
  lastGpsUpdate: string;
  lastKnownStop: string;
  scheduleEta: number;
  verifiedBy: number;
}

interface TrafficFactor {
  type: 'traffic' | 'weather' | 'event';
  severity: 'low' | 'medium' | 'high';
  description: string;
  delay: number;
}

export function PassengerDashboard({ onLogout }: PassengerDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [alarmSet, setAlarmSet] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [feedbackGiven, setFeedbackGiven] = useState<{[key: string]: boolean}>({});

  const [buses] = useState<Bus[]>([
    {
      id: '1',
      number: '42A',
      route: 'Downtown → Airport',
      currentLocation: 'Main St & 5th Ave',
      eta: 8,
      isLive: true,
      lastUpdated: '2 min ago',
      lastGpsUpdate: '9:18 AM',
      lastKnownStop: 'Stop A',
      scheduleEta: 10,
      verifiedBy: 120
    },
    {
      id: '2', 
      number: '15B',
      route: 'University → Mall',
      currentLocation: 'Campus Dr',
      eta: 15,
      isLive: true,
      lastUpdated: '1 min ago',
      lastGpsUpdate: '9:19 AM',
      lastKnownStop: 'Campus Station',
      scheduleEta: 18,
      verifiedBy: 85
    },
    {
      id: '3',
      number: '23C',
      route: 'Hospital → Beach',
      currentLocation: 'Oak Street',
      eta: 22,
      isLive: false,
      lastUpdated: '15 min ago',
      lastGpsUpdate: '9:05 AM',
      lastKnownStop: 'Hospital District',
      scheduleEta: 22,
      verifiedBy: 45
    }
  ]);

  const [trafficFactors] = useState<TrafficFactor[]>([
    {
      type: 'traffic',
      severity: 'medium',
      description: 'Heavy traffic on Main St',
      delay: 3
    },
    {
      type: 'weather',
      severity: 'low', 
      description: 'Light rain affecting visibility',
      delay: 1
    }
  ]);

  const filteredBuses = buses.filter(bus =>
    bus.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const setDestinationAlarm = (bus: Bus) => {
    setAlarmSet(true);
    setSelectedBus(bus);
    
    // Enhanced notification with vibration simulation
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    
    // Simulate alarm notification with enhanced styling
    setTimeout(() => {
      // Create custom notification div
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="
          position: fixed; 
          top: 20px; 
          left: 50%; 
          transform: translateX(-50%); 
          background: linear-gradient(135deg, #10b981, #059669); 
          color: white; 
          padding: 16px 24px; 
          border-radius: 12px; 
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
          animation: slideDown 0.3s ease-out;
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <div>
            <div style="font-size: 16px;">🚌 Bus ${bus.number} Alert!</div>
            <div style="font-size: 14px; opacity: 0.9;">Arriving in 5 minutes - Get ready!</div>
          </div>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Add animation keyframes
      if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
          @keyframes slideDown {
            from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 5000);
      
      setAlarmSet(false);
    }, 3000); // Demo: 3 seconds instead of actual 5 minutes
  };

  const sendSMSInfo = (bus: Bus) => {
    alert(`📱 SMS sent! Bus ${bus.number} info sent to your phone.`);
  };

  const giveFeedback = (busId: string, accurate: boolean) => {
    setFeedbackGiven({...feedbackGiven, [busId]: true});
    alert(accurate ? '✅ Thank you for confirming!' : '❌ Thanks for the feedback, we\'ll improve our predictions.');
  };

  // Simulate network connectivity
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1); // 90% uptime simulation
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg p-2">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">BusTracker</h1>
                <div className="flex items-center space-x-1">
                  {isOnline ? (
                    <Wifi className="w-3 h-3 text-green-500" />
                  ) : (
                    <WifiOff className="w-3 h-3 text-red-500" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {isOnline ? 'Live GPS' : 'Schedule Mode'}
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

      <div className="px-4 py-4 space-y-4">
        {/* Search Bar */}
        <Card>
          <CardContent className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by route number, source, or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Network Status Alert */}
        {!isOnline && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <WifiOff className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Using schedule mode</strong> - Live GPS tracking temporarily unavailable. 
              ETAs are based on timetable + last known positions to ensure reliability.
            </AlertDescription>
          </Alert>
        )}

        {/* Active Alarm */}
        {alarmSet && selectedBus && (
          <Alert className="border-emerald-200 bg-emerald-50 shadow-sm">
            <Bell className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800">
              <div className="flex items-center justify-between">
                <div>
                  <strong>🔔 Destination alarm active for Bus {selectedBus.number}</strong>
                  <p className="text-sm mt-1">You'll get a notification + vibration 5 minutes before arrival</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => {
                    setAlarmSet(false);
                    setSelectedBus(null);
                  }}
                  className="text-emerald-700 hover:text-emerald-800"
                >
                  Cancel
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Mobile Tabs */}
        <Tabs defaultValue="buses" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="buses" className="text-sm">
              <Bus className="w-4 h-4 mr-1" />
              Buses
            </TabsTrigger>
            <TabsTrigger value="map" className="text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              Map
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-sm">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buses" className="space-y-4 mt-4">
            {/* Bus List */}
            <div className="space-y-3">
              {filteredBuses.map((bus) => (
                <Card key={bus.id} className="hover:shadow-md transition-shadow active:scale-[0.98]">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-sm">
                            Bus {bus.number}
                          </Badge>
                          <Badge 
                            variant={bus.isLive ? "default" : "secondary"} 
                            className={bus.isLive ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600 text-white"}
                          >
                            {bus.isLive ? 'Live GPS' : 'Schedule Estimate'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-lg">{bus.isLive ? bus.eta : bus.scheduleEta} min</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-base">{bus.route}</h3>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {bus.currentLocation}
                        </p>
                        
                        {/* Last GPS Update Timestamp */}
                        <div className="flex items-center mt-2 text-xs text-muted-foreground italic">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>Expected at {new Date(Date.now() + (bus.isLive ? bus.eta : bus.scheduleEta) * 60000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                          <span className="mx-1">•</span>
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>last update at {bus.lastKnownStop}, {bus.lastGpsUpdate}</span>
                        </div>
                      </div>

                      {/* ETA Factors */}
                      {trafficFactors.length > 0 && (
                        <div className="flex items-center space-x-3">
                          {trafficFactors.map((factor, index) => (
                            <div key={index} className="flex items-center space-x-1">
                              {factor.type === 'traffic' && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                              {factor.type === 'weather' && <CloudRain className="w-3 h-3 text-blue-500" />}
                              {factor.type === 'event' && <Calendar className="w-3 h-3 text-purple-500" />}
                              <span className="text-xs text-muted-foreground">+{factor.delay}min</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Enhanced Destination Alarm Button */}
                      <div className="pt-3 border-t">
                        <Button 
                          onClick={() => setDestinationAlarm(bus)}
                          disabled={alarmSet && selectedBus?.id === bus.id}
                          className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium shadow-md"
                        >
                          <Bell className="w-5 h-5 mr-2" />
                          {alarmSet && selectedBus?.id === bus.id ? 'Alarm Set - 5min Alert' : 'Set Destination Alarm'}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-1">
                          Get notified 5 minutes before arrival
                        </p>
                      </div>

                      {/* Secondary Actions */}
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => sendSMSInfo(bus)}
                          className="flex-1 h-10"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          SMS Info
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 h-10"
                        >
                          <MapPin className="w-4 h-4 mr-1" />
                          Track
                        </Button>
                      </div>

                      {/* Feedback & Verification */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <Badge variant="outline" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          Verified by {bus.verifiedBy}
                        </Badge>
                        {!feedbackGiven[bus.id] && (
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-muted-foreground">Accurate?</span>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => giveFeedback(bus.id, true)}
                              className="h-8 px-2"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => giveFeedback(bus.id, false)}
                              className="h-8 px-2"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="mt-4">
            {/* Map View */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <MapPin className="w-5 h-5" />
                  <span>Live Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative h-80 bg-gray-100 overflow-hidden">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1730994061179-9cbfbef24a9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFwJTIwbmF2aWdhdGlvbnxlbnwxfHx8fDE3NTY5Mjc1MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="City Map"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  {/* Bus markers */}
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm flex items-center shadow-lg">
                    <Bus className="w-4 h-4 mr-1" />
                    42A
                  </div>
                  <div className="absolute bottom-8 right-8 bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm flex items-center shadow-lg">
                    <Bus className="w-4 h-4 mr-1" />
                    15B
                  </div>
                  <div className="absolute top-1/2 left-1/2 bg-orange-600 text-white px-3 py-2 rounded-lg text-sm flex items-center shadow-lg">
                    <Bus className="w-4 h-4 mr-1" />
                    23C
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick SMS */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <MessageSquare className="w-5 h-5" />
                  <span>Quick SMS</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Get bus info via SMS using shortcode
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Text:</strong> BUS [route number]<br />
                    <strong>To:</strong> 12345
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Example: Text "BUS 42A" to 12345
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="mt-4">
            {/* Traffic Alerts & System Status */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Traffic Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trafficFactors.map((factor, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      {factor.type === 'traffic' && <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />}
                      {factor.type === 'weather' && <CloudRain className="w-5 h-5 text-blue-500 mt-0.5" />}
                      {factor.type === 'event' && <Calendar className="w-5 h-5 text-purple-500 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{factor.description}</p>
                        <p className="text-xs text-muted-foreground">+{factor.delay} min delay</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    {isOnline ? (
                      <Wifi className="w-5 h-5 text-green-500" />
                    ) : (
                      <WifiOff className="w-5 h-5 text-yellow-500" />
                    )}
                    <span>System Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">GPS Tracking:</span>
                    <Badge variant={isOnline ? "default" : "secondary"} className={isOnline ? "bg-green-500" : "bg-yellow-500 text-white"}>
                      {isOnline ? 'Live GPS Active' : 'Schedule Mode'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Data Freshness:</span>
                    <span className="text-sm text-muted-foreground">
                      {isOnline ? 'Real-time updates' : 'Based on last known positions'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="mb-1">✅ No "ghost bus" errors - we use hybrid fallback</p>
                    <p>🔄 Automatic switch between GPS and schedule data</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Multilingual Chatbot */}
      <ChatBot userRole="passenger" />
    </div>
  );
}