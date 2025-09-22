import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Shield, Phone, AlertTriangle, MapPin, MessageSquare, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EmergencyContact {
  number: string;
  service: string;
  icon: React.ReactNode;
}

export function WomenSafetyButton() {
  const [isPressed, setIsPressed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string>('');

  const emergencyContacts: EmergencyContact[] = [
    { number: '100', service: 'Police', icon: <Shield className="w-5 h-5" /> },
    { number: '101', service: 'Fire Brigade', icon: <AlertTriangle className="w-5 h-5" /> },
    { number: '108', service: 'Ambulance', icon: <Phone className="w-5 h-5" /> },
    { number: '112', service: 'Unified Emergency', icon: <Phone className="w-5 h-5" /> },
    { number: '1091', service: 'Women Helpline', icon: <Users className="w-5 h-5" /> }
  ];

  // Get user's current location with better error handling
  useEffect(() => {
    if (showModal && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position);
          setLocationError('');
        },
        (error) => {
          let errorMsg = 'Unable to get location. ';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg += 'Please enable location permission.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg += 'Location service unavailable.';
              break;
            case error.TIMEOUT:
              errorMsg += 'Location request timed out.';
              break;
            default:
              errorMsg += 'Please enable GPS.';
              break;
          }
          setLocationError(errorMsg);
          console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else if (showModal && !navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, [showModal]);

  const handleSOSPress = () => {
    setIsPressed(true);
    setShowModal(true);
    
    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    // Reset button state after a moment
    setTimeout(() => {
      setIsPressed(false);
    }, 3000);
  };

  const makeEmergencyCall = (number: string, service: string) => {
    try {
      // Show feedback
      toast.error(`🚨 Calling ${service} (${number})`, {
        description: "Connecting to emergency services...",
        duration: 3000,
      });

      // Trigger device's native dialer
      window.location.href = `tel:${number}`;
      
      // Close modal after initiating call
      setShowModal(false);
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
    const locationText = `Emergency! I need help. My location: https://maps.google.com/maps?q=${latitude},${longitude}`;
    
    try {
      // Show immediate feedback
      toast.error("🚨 SOS Activated - Sending location!", {
        description: "Sharing your location with emergency contacts...",
        duration: 5000,
      });

      // Try to share via native Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: 'Emergency SOS Alert',
          text: locationText,
        });
      } else {
        // Fallback: Copy to clipboard and open SMS
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(locationText);
          toast.success("📋 Location copied to clipboard. Paste into your SMS app.");
        }
        
        // Open SMS with pre-filled emergency message
        const smsUrl = `sms:?body=${encodeURIComponent(locationText)}`;
        window.location.href = smsUrl;
      }

      // Also trigger unified emergency number
      setTimeout(() => {
        window.location.href = 'tel:112';
      }, 2000);

      setShowModal(false);
      
    } catch (error) {
      console.error('Failed to send location:', error);
      toast.error("Unable to share location automatically. Please call 112 manually.");
      
      // Fallback: Just trigger emergency dialer
      window.location.href = 'tel:112';
    }
  };

  return (
    <>
      <div className="fixed top-20 right-4 z-40">
        <Button
          onClick={handleSOSPress}
          className={`h-16 w-16 rounded-full shadow-xl transition-all duration-300 ${
            isPressed 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
          } border-3 border-white ring-2 ring-red-200`}
          size="sm"
        >
          {isPressed ? (
            <AlertTriangle className="w-7 h-7 text-white animate-bounce" />
          ) : (
            <div className="flex flex-col items-center">
              <Shield className="w-6 h-6 text-white" />
              <span className="text-xs text-white font-bold mt-0.5">SOS</span>
            </div>
          )}
        </Button>
        
        {/* Enhanced ripple effect when pressed */}
        {isPressed && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-75"></div>
            <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping opacity-50" style={{ animationDelay: '0.1s' }}></div>
          </>
        )}
        
        {/* Subtle pulsing ring when not pressed for visibility */}
        {!isPressed && (
          <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-pulse opacity-30"></div>
        )}
      </div>

      {/* Emergency Services Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-600">
              <Shield className="w-5 h-5" />
              <span>Emergency SOS</span>
            </DialogTitle>
            <DialogDescription>
              Choose an emergency service to call, or send your location to contacts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Emergency Contact Numbers */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Emergency Services:</h4>
              <div className="grid grid-cols-1 gap-2">
                {emergencyContacts.map((contact) => (
                  <Button
                    key={contact.number}
                    onClick={() => makeEmergencyCall(contact.number, contact.service)}
                    variant="outline"
                    className="justify-start h-12 border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-red-600">{contact.icon}</div>
                      <div className="text-left">
                        <div className="font-medium">{contact.service}</div>
                        <div className="text-sm text-muted-foreground">{contact.number}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Location and SOS Button */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {currentLocation ? (
                  <span className="text-green-600">Location obtained</span>
                ) : locationError ? (
                  <span className="text-red-600">{locationError}</span>
                ) : (
                  <span>Getting your location...</span>
                )}
              </div>
              
              <Button
                onClick={sendLocationAndTriggerSOS}
                disabled={!currentLocation}
                className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-medium"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Send My Location & Trigger SOS
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                This will share your GPS location with emergency contacts and call 112
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
