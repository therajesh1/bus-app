import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Shield, 
  Phone, 
  AlertTriangle, 
  MapPin, 
  MessageSquare, 
  Users,
  Navigation,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface EmergencyService {
  number: string;
  service: string;
  icon: React.ReactNode;
  description: string;
}

interface SOSButtonProps {
  variant?: 'fixed' | 'header';
}

export function SOSButton({ variant = 'fixed' }: SOSButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  const emergencyServices: EmergencyService[] = [
    { 
      number: '100', 
      service: 'Police', 
      icon: <Shield className="w-5 h-5" />, 
      description: 'Law enforcement emergency' 
    },
    { 
      number: '101', 
      service: 'Fire Brigade', 
      icon: <AlertTriangle className="w-5 h-5" />, 
      description: 'Fire & rescue services' 
    },
    { 
      number: '108', 
      service: 'Ambulance', 
      icon: <Phone className="w-5 h-5" />, 
      description: 'Medical emergency' 
    },
    { 
      number: '112', 
      service: 'Unified Emergency', 
      icon: <Phone className="w-5 h-5" />, 
      description: 'All emergency services' 
    },
    { 
      number: '1091', 
      service: 'Women Helpline', 
      icon: <Users className="w-5 h-5" />, 
      description: 'Women safety support' 
    }
  ];

  // Load emergency contacts from localStorage
  useEffect(() => {
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts));
    }
  }, []);

  // Get user's current location with better error handling
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation(position);
        setLocationError('');
        setIsGettingLocation(false);
        toast.success('📍 Location obtained successfully');
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMsg = 'Unable to get location. ';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg += 'Please enable location permission in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg += 'Location service is currently unavailable.';
            break;
          case error.TIMEOUT:
            errorMsg += 'Location request timed out. Please try again.';
            break;
          default:
            errorMsg += 'Please enable GPS and try again.';
            break;
        }
        
        setLocationError(errorMsg);
        toast.error('Failed to get location');
      },
      options
    );
  };

  // Auto-get location when modal opens
  useEffect(() => {
    if (showModal) {
      getCurrentLocation();
    }
  }, [showModal]);

  const handleSOSPress = () => {
    setIsPressed(true);
    setShowModal(true);
    
    // Enhanced vibration pattern for SOS
    if ('vibrate' in navigator) {
      // SOS pattern: short-short-short, long-long-long, short-short-short
      navigator.vibrate([100, 50, 100, 50, 100, 200, 300, 100, 300, 100, 300, 200, 100, 50, 100, 50, 100]);
    }

    // Visual feedback
    setTimeout(() => {
      setIsPressed(false);
    }, 3000);

    // Log SOS activation
    toast.error('🚨 SOS Activated', {
      description: 'Emergency assistance panel opened',
      duration: 4000,
    });
  };

  const makeEmergencyCall = (number: string, service: string) => {
    try {
      toast.error(`🚨 Calling ${service} (${number})`, {
        description: "Connecting to emergency services...",
        duration: 4000,
      });

      // Trigger device's native dialer
      window.location.href = `tel:${number}`;
      
      // Keep modal open for quick access to other services
      // setShowModal(false);
    } catch (error) {
      console.error('Failed to initiate emergency call:', error);
      toast.error(`Unable to call ${service}. Please dial ${number} manually.`);
    }
  };

  const sendLocationAndTriggerSOS = async () => {
    if (!currentLocation) {
      toast.error("Location not available. Please enable GPS and try again.");
      return;
    }

    const { latitude, longitude } = currentLocation.coords;
    const accuracy = currentLocation.coords.accuracy;
    const timestamp = new Date().toLocaleString();
    
    // Enhanced location message with more details
    const locationText = `🚨 EMERGENCY SOS ALERT 🚨
    
I need immediate help! My current location:
📍 https://maps.google.com/maps?q=${latitude},${longitude}
🎯 Accuracy: ${Math.round(accuracy)}m
⏰ Time: ${timestamp}
📱 From: BusTracker App

Please contact emergency services if you cannot reach me.`;
    
    try {
      // Show immediate feedback
      toast.error("🚨 SOS ACTIVATED - Sending location!", {
        description: "Sharing your location with emergency contacts...",
        duration: 6000,
      });

      // Try Web Share API first (better for mobile)
      if (navigator.share && emergencyContacts.length > 0) {
        await navigator.share({
          title: '🚨 EMERGENCY SOS ALERT',
          text: locationText,
        });
        
        toast.success("✅ Location shared successfully!");
      } else {
        // Fallback 1: Copy to clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(locationText);
          toast.success("📋 Emergency message copied to clipboard!", {
            description: "Paste it into your messaging app to share with contacts",
            duration: 5000,
          });
        }
        
        // Fallback 2: Open SMS with pre-filled message
        if (emergencyContacts.length > 0) {
          // Use first emergency contact for SMS
          const primaryContact = emergencyContacts[0];
          const smsUrl = `sms:${primaryContact.phone}?body=${encodeURIComponent(locationText)}`;
          window.open(smsUrl, '_blank');
        } else {
          // No contacts saved - open SMS composer
          const smsUrl = `sms:?body=${encodeURIComponent(locationText)}`;
          window.open(smsUrl, '_blank');
          
          toast.info("📱 SMS opened with emergency message", {
            description: "Add recipients and send to your emergency contacts",
            duration: 4000,
          });
        }
      }

      // Also trigger WhatsApp if available
      setTimeout(() => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(locationText)}`;
        window.open(whatsappUrl, '_blank');
      }, 1000);

      // Auto-trigger unified emergency number after a delay
      setTimeout(() => {
        toast.error("🚨 Auto-calling emergency services...", {
          description: "Calling 112 (Unified Emergency)",
          duration: 3000,
        });
        window.location.href = 'tel:112';
      }, 3000);

      // Close modal after initiating all emergency protocols
      setTimeout(() => {
        setShowModal(false);
      }, 4000);
      
    } catch (error) {
      console.error('Failed to send location:', error);
      toast.error("Unable to share location automatically.", {
        description: "Please manually call emergency services: 112",
        duration: 5000,
      });
      
      // Fallback: Just trigger emergency dialer
      window.location.href = 'tel:112';
    }
  };

  const retryLocation = () => {
    getCurrentLocation();
  };

  // Render different button styles based on variant
  const buttonContent = (
    <Button
      onClick={handleSOSPress}
      className={`${
        variant === 'header' 
          ? `h-9 px-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md transition-all duration-300 ${
              isPressed ? 'animate-pulse scale-110' : 'hover:scale-105'
            }` 
          : `h-14 w-14 rounded-full shadow-xl transition-all duration-300 ${
              isPressed 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse scale-110' 
                : 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105'
            } border-2 border-white ring-4 ring-red-200/50`
      }`}
      size={variant === 'header' ? 'sm' : 'sm'}
    >
      {isPressed ? (
        <AlertTriangle className={`${variant === 'header' ? 'w-4 h-4' : 'w-6 h-6'} text-white animate-bounce`} />
      ) : variant === 'header' ? (
        <div className="flex items-center space-x-1">
          <Shield className="w-4 h-4 text-white" />
          <span className="text-sm font-bold">SOS</span>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Shield className="w-5 h-5 text-white" />
          <span className="text-xs text-white font-bold mt-0.5">SOS</span>
        </div>
      )}
    </Button>
  );

  return (
    <>
      {/* SOS Button */}
      {variant === 'fixed' ? (
        <div className="fixed bottom-6 right-4 z-50">
          {buttonContent}
          
          {/* Enhanced ripple effects for fixed variant */}
          {isPressed && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-75"></div>
              <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping opacity-50" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute inset-0 rounded-full border-1 border-red-200 animate-ping opacity-25" style={{ animationDelay: '0.4s' }}></div>
            </>
          )}
          
          {/* Subtle always-visible indicator for fixed variant */}
          {!isPressed && (
            <div className="absolute inset-0 rounded-full border-2 border-red-300/40 animate-pulse"></div>
          )}
        </div>
      ) : (
        buttonContent
      )}

      {/* Emergency Services Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-600">
              <Shield className="w-5 h-5" />
              <span>Emergency SOS</span>
              <Badge variant="destructive" className="ml-auto animate-pulse">
                ACTIVE
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Choose an emergency service to call, or send your location to contacts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Location Status */}
            <div className="bg-slate-50 p-3 rounded-lg border">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Location Status:</span>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                {isGettingLocation ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-muted-foreground">Getting your location...</span>
                  </>
                ) : currentLocation ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Location obtained</span>
                    <Badge variant="outline" className="text-xs">
                      ±{Math.round(currentLocation.coords.accuracy)}m
                    </Badge>
                  </>
                ) : locationError ? (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">Location failed</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={retryLocation}
                      className="text-xs h-6 px-2 ml-2"
                    >
                      Retry
                    </Button>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-600">Waiting for location...</span>
                  </>
                )}
              </div>
              {locationError && (
                <p className="text-xs text-red-600 mt-1">{locationError}</p>
              )}
            </div>

            {/* Emergency Services */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Emergency Services:</span>
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {emergencyServices.map((service) => (
                  <Button
                    key={service.number}
                    onClick={() => makeEmergencyCall(service.number, service.service)}
                    variant="outline"
                    className="justify-start h-auto p-3 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="text-red-600">{service.icon}</div>
                      <div className="text-left flex-1">
                        <div className="font-medium">{service.service}</div>
                        <div className="text-xs text-muted-foreground">{service.description}</div>
                      </div>
                      <Badge variant="outline" className="text-xs font-mono">
                        {service.number}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* SOS Location Sharing */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Emergency Location Sharing:</span>
              </h4>
              
              {emergencyContacts.length > 0 ? (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 mb-2">
                    <strong>{emergencyContacts.length} emergency contact(s) configured:</strong>
                  </p>
                  <div className="text-xs space-y-1">
                    {emergencyContacts.slice(0, 3).map((contact) => (
                      <div key={contact.id} className="text-green-700">
                        • {contact.name} ({contact.relationship})
                      </div>
                    ))}
                    {emergencyContacts.length > 3 && (
                      <div className="text-green-700">• +{emergencyContacts.length - 3} more contacts</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>No emergency contacts configured.</strong>
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Location will be shared via general messaging apps. Configure contacts in Settings for better targeting.
                  </p>
                </div>
              )}
              
              <Button
                onClick={sendLocationAndTriggerSOS}
                disabled={!currentLocation && !locationError}
                className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-medium shadow-lg"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Send My Location & Trigger SOS
              </Button>
              
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>This will:</p>
                <ul className="text-left space-y-0.5">
                  <li>• Share your GPS location with emergency contacts</li>
                  <li>• Open messaging apps with pre-filled emergency message</li>
                  <li>• Automatically call 112 (Unified Emergency)</li>
                  <li>• Send location via WhatsApp if available</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
