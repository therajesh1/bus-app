import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Volume2, VolumeX, Mic, Settings, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceAssistantProps {
  userRole: 'passenger' | 'driver';
}

interface Announcement {
  id: string;
  text: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  language: string;
}

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  ttsLang: string;
}

export function VoiceAssistant({ userRole }: VoiceAssistantProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<string>('');
  const [volume, setVolume] = useState(0.8);

  // Enhanced button styles for better visibility
  // Function to render the voice assistant buttons
  const renderButtons = () => (
    <div className="flex items-center gap-3">
      <Button
        size="lg"
        className={`
          rounded-full 
          ${isEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'} 
          text-white 
          p-4 
          flex 
          items-center 
          justify-center 
          transition-all 
          duration-300 
          shadow-lg 
          hover:shadow-blue-400/50
          scale-100 
          hover:scale-105
        `}
        onClick={() => setIsEnabled(!isEnabled)}
      >
        <Mic className="w-6 h-6" />
      </Button>

      <Button
        size="lg"
        className={`
          rounded-full 
          bg-gray-700 
          hover:bg-gray-800 
          text-white 
          p-4 
          flex 
          items-center 
          justify-center 
          transition-all 
          duration-300 
          shadow-lg 
          hover:shadow-gray-400/50
          scale-100 
          hover:scale-105
        `}
        onClick={() => setShowSettings(true)}
      >
        <Settings className="w-6 h-6" />
      </Button>
    </div>
  );
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [showSettings, setShowSettings] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const announcementQueue = useRef<Announcement[]>([]);
  const isPlaying = useRef(false);

  // Indian languages supported
  const supportedLanguages: LanguageOption[] = [
    { code: 'en-IN', name: 'English', nativeName: 'English (India)', ttsLang: 'en-IN' },
    { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', ttsLang: 'hi-IN' },
    { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', ttsLang: 'bn-IN' },
    { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', ttsLang: 'ta-IN' },
    { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', ttsLang: 'te-IN' },
    { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', ttsLang: 'mr-IN' },
    { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', ttsLang: 'gu-IN' },
    { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', ttsLang: 'kn-IN' },
    { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', ttsLang: 'pa-IN' }
  ];

  // Multilingual announcements
  const multilingualAnnouncements = {
    passenger: {
      'en-IN': [
        "Bus 42A will arrive in 5 minutes at your stop.",
        "Next stop: Model Town. Please prepare to board.",
        "Your bus is approaching. Bus number 42A is 2 minutes away.",
        "Traffic delay detected. Your bus will be 3 minutes late.",
        "Bus 15B has arrived at University Campus stop."
      ],
      'hi-IN': [
        "बस 42A आपके स्टॉप पर 5 मिनट में आएगी।",
        "अगला स्टॉप: मॉडल टाउन। कृपया बोर्ड करने के लिए तैयार रहें।",
        "आपकी बस आ रही है। बस नंबर 42A 2 मिनट दूर है।",
        "ट्रैफिक देरी का पता चला। आपकी बस 3 मिनट देर से आएगी।",
        "बस 15B यूनिवर्सिटी कैंपस स्टॉप पर आ गई है।"
      ],
      'ta-IN': [
        "பேருந்து 42A உங்கள் நிறுத்தத்தில் 5 நிமிடங்களில் வரும்.",
        "அடுத்த நிறுத்தம்: மாடல் டவுன். தயவுசெய்து ஏறுவதற்கு தயாராகுங்கள்.",
        "உங்கள் பேருந்து நெருங்குகிறது. பேருந்து எண் 42A 2 நிமிடங்கள் தொலைவில்.",
        "போக்குவரத்து தடை கண்டறியப்பட்டது. உங்கள் பேருந்து 3 நிமிடங்கள் தாமதமாகும்.",
        "பேருந்து 15B பல்கலைக்கழக வளாக நிறுத்தத்தில் வந்துவிட்டது."
      ]
    },
    driver: {
      'en-IN': [
        "Next stop: Model Town in 800 meters.",
        "Passenger boarding alert at current location.",
        "GPS signal restored. Location tracking active.",
        "Route deviation detected. Please follow recommended path.",
        "Shift ending in 30 minutes. Please prepare for handover."
      ],
      'hi-IN': [
        "अगला स्टॉप: मॉडल टाउन 800 मीटर में।",
        "वर्तमान स्थान पर यात्री बोर्डिंग अलर्ट।",
        "GPS सिग्नल बहाल। स्थान ट्रैकिंग सक्रिय।",
        "रूट विचलन का पता चला। कृपया सुझाए गए पथ का पालन करें।",
        "शिफ्ट 30 मिनट में समाप्त हो रही है। हैंडओवर के लिए तैयार रहें।"
      ],
      'ta-IN': [
        "அடுத்த நிறுத்தம்: மாடல் டவுன் 800 மீட்டரில்.",
        "தற்போதைய இடத்தில் பயணிகள் ஏறும் எச்சரிக்கை.",
        "GPS சிக்னல் மீட்டமைக்கப்பட்டது. இடம் கண்காணிப்பு செயலில்.",
        "பாதை விலகல் கண்டறியப்பட்டது. பரிந்துரைக்கப்பட்ட பாதையைப் பின்பற்றவும்.",
        "மாற்றம் 30 நிமிடங்களில் முடிகிறது. கையளிப்புக்கு தயாராகுங்கள்."
      ]
    }
  };

  // Initialize voices and detect user's language
  useEffect(() => {
    const loadVoices = () => {
      try {
        const voices = speechSynthesis.getVoices();
        setAvailableVoices(voices);

        // Auto-detect user's language preference
        const userLang = navigator.language || 'en-IN';
        const supportedLang = supportedLanguages.find(lang => 
          userLang.startsWith(lang.code.split('-')[0])
        );
        if (supportedLang) {
          setSelectedLanguage(supportedLang.code);
        }
      } catch (error) {
        // Handle speech synthesis not being available
        if (process.env.NODE_ENV === 'development') {
          console.warn('Speech synthesis not available:', error);
        }
      }
    };

    // Check if speech synthesis is available
    if ('speechSynthesis' in window) {
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Text-to-Speech function with multilingual support
  const speak = (
    text: string, 
    priority: 'low' | 'medium' | 'high' = 'medium', 
    language: string = selectedLanguage
  ) => {
    if (!isEnabled || !('speechSynthesis' in window)) return;

    try {
      // Add to queue
      const announcement: Announcement = {
        id: Date.now().toString(),
        text,
        priority,
        timestamp: new Date(),
        language
      };

      announcementQueue.current.push(announcement);
      processQueue();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to add announcement to queue:', error);
      }
    }
  };

  const processQueue = () => {
    if (isPlaying.current || announcementQueue.current.length === 0 || !('speechSynthesis' in window)) return;

    try {
      // Sort by priority (high > medium > low)
      announcementQueue.current.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      const nextAnnouncement = announcementQueue.current.shift();
      if (!nextAnnouncement) return;

      isPlaying.current = true;
      setCurrentAnnouncement(nextAnnouncement.text);

      // Create speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(nextAnnouncement.text);
      utterance.volume = Math.min(Math.max(volume, 0), 1); // Clamp volume between 0-1
      utterance.rate = selectedLanguage.startsWith('en') ? 0.9 : 0.8; // Slightly slower for non-English
      utterance.pitch = 1.0;
      
      // Find best voice for selected language
      const targetLang = nextAnnouncement.language;
      let bestVoice = availableVoices.find(voice => voice.lang === targetLang);
      
      if (!bestVoice) {
        // Fallback: find voice by language code (e.g., 'hi' for 'hi-IN')
        const langCode = targetLang.split('-')[0];
        bestVoice = availableVoices.find(voice => voice.lang.startsWith(langCode));
      }
      
      if (!bestVoice && targetLang.includes('IN')) {
        // Fallback: find any Indian voice
        bestVoice = availableVoices.find(voice => 
          voice.lang.includes('IN') || voice.name.toLowerCase().includes('indian')
        );
      }
      
      if (!bestVoice) {
        // Final fallback: use default system voice
        bestVoice = availableVoices.find(voice => voice.default);
      }

      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      utterance.onend = () => {
        isPlaying.current = false;
        setCurrentAnnouncement('');
        
        // Process next announcement after a brief pause
        setTimeout(() => {
          processQueue();
        }, 1000);
      };

      utterance.onerror = (error) => {
        isPlaying.current = false;
        setCurrentAnnouncement('');
        
        // Only log error in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Speech synthesis error:', error);
        }
        
        // Try to process next announcement
        setTimeout(() => {
          processQueue();
        }, 1000);
      };

      speechSynthesis.speak(utterance);
    } catch (error) {
      isPlaying.current = false;
      setCurrentAnnouncement('');
      
      if (process.env.NODE_ENV === 'development') {
        console.warn('Error processing speech queue:', error);
      }
      
      // Try to process next announcement
      setTimeout(() => {
        processQueue();
      }, 1000);
    }
  };

  // Simulate real-time announcements with multilingual support
  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      const langAnnouncements = multilingualAnnouncements[userRole][selectedLanguage];
      const fallbackAnnouncements = multilingualAnnouncements[userRole]['en-IN'];
      
      const announcements = langAnnouncements || fallbackAnnouncements;
      const randomAnnouncement = announcements[Math.floor(Math.random() * announcements.length)];
      
      // Random chance of announcement (simulate real conditions)
      if (Math.random() > 0.7) { // 30% chance every interval
        speak(randomAnnouncement, Math.random() > 0.8 ? 'high' : 'medium', selectedLanguage);
      }
    }, 20000); // Every 20 seconds (reduced frequency for better UX)

    return () => clearInterval(interval);
  }, [isEnabled, userRole, selectedLanguage]);

  // Enhanced bus arrival simulation for passengers with contextual updates
  useEffect(() => {
    if (!isEnabled || userRole !== 'passenger') return;

    const busArrivalTimer = setTimeout(() => {
      const langAnnouncements = multilingualAnnouncements.passenger[selectedLanguage];
      const announcement = langAnnouncements ? langAnnouncements[0] : multilingualAnnouncements.passenger['en-IN'][0];
      speak(announcement, 'high', selectedLanguage);
      
      // Follow-up announcement about bus approaching 
      setTimeout(() => {
        const approachingMsg = langAnnouncements ? langAnnouncements[2] : multilingualAnnouncements.passenger['en-IN'][2];
        speak(approachingMsg, 'high', selectedLanguage);
      }, 180000); // 3 minutes later
      
    }, 8000); // Initial announcement after 8 seconds

    return () => clearTimeout(busArrivalTimer);
  }, [isEnabled, userRole, selectedLanguage]);

  // Real-time updates simulation (would connect to actual backend in production)
  useEffect(() => {
    if (!isEnabled) return;

    // Simulate traffic updates
    const trafficTimer = setTimeout(() => {
      const trafficMsgs = {
        'en-IN': "Traffic delay detected on your route. Bus will be 3 minutes late.",
        'hi-IN': "आपके रूट पर ट्रैफिक की देरी। बस 3 मिनट देर से आएगी।",
        'ta-IN': "உங்கள் வழியில் போக்குவரத்து தாமதம். பேருந்து 3 நிமிடங்கள் தாமதமாகும்।"
      };
      
      const message = trafficMsgs[selectedLanguage as keyof typeof trafficMsgs] || trafficMsgs['en-IN'];
      speak(message, 'high', selectedLanguage);
    }, 30000);

    return () => clearTimeout(trafficTimer);
  }, [isEnabled, selectedLanguage]);

  const toggleVoiceAssistant = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    
    if (newState) {
      toast.success("🔊 Voice Assistant Activated", {
        description: `Audio updates in ${supportedLanguages.find(l => l.code === selectedLanguage)?.name || 'English'}`,
        duration: 3000,
      });
      
      // Welcome message in selected language
      setTimeout(() => {
        const welcomeMessages = {
          'en-IN': userRole === 'passenger' 
            ? "Voice assistant activated. You'll receive updates about bus arrivals and stops."
            : "Voice assistant activated. You'll receive navigation updates and alerts.",
          'hi-IN': userRole === 'passenger'
            ? "वॉयस असिस्टेंट सक्रिय। आपको बस आगमन और स्टॉप के बारे में अपडेट मिलेंगे।"
            : "वॉयस असिस्टेंट सक्रिय। आपको नेवीगेशन अपडेट और अलर्ट मिलेंगे।",
          'ta-IN': userRole === 'passenger'
            ? "குரல் உதவியாளர் செயல்படுத்தப்பட்டது. பேருந்து வருகை மற்றும் நிறுத்தங்கள் பற்றிய அப்டேட்களைப் பெறுவீர்கள்."
            : "குரல் உதவியாளர் செயல்படுத்தப்பட்டது. வழிசெலுத்தல் அப்டேட்கள் மற்றும் எச்சரிக்கைகளைப் பெறுவீர்கள்."
        };
        
        const message = welcomeMessages[selectedLanguage as keyof typeof welcomeMessages] || welcomeMessages['en-IN'];
        speak(message, 'medium', selectedLanguage);
      }, 1000);
    } else {
      // Stop any current speech
      try {
        if ('speechSynthesis' in window) {
          speechSynthesis.cancel();
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Error stopping speech synthesis:', error);
        }
      }
      announcementQueue.current = [];
      isPlaying.current = false;
      setCurrentAnnouncement('');
      
      toast.info("🔇 Voice Assistant Disabled", {
        description: "Audio announcements have been turned off.",
        duration: 2000,
      });
    }
  };

  const stopCurrentAnnouncement = () => {
    try {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      isPlaying.current = false;
      setCurrentAnnouncement('');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Error stopping speech:', error);
      }
      isPlaying.current = false;
      setCurrentAnnouncement('');
    }
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    const langName = supportedLanguages.find(l => l.code === langCode)?.name || 'English';
    
    toast.success(`🌐 Language changed to ${langName}`, {
      description: "Voice announcements will now be in this language.",
      duration: 2000,
    });

    // Test announcement in new language
    if (isEnabled) {
      setTimeout(() => {
        const testMessages = {
          'en-IN': "Language switched to English. Voice assistant is ready.",
          'hi-IN': "भाषा हिंदी में बदल दी गई। वॉयस असिस्टेंट तैयार है।",
          'ta-IN': "மொழி தமிழுக்கு மாற்றப்பட்டது. குரல் உதவியாளர் தயார்।"
        };
        
        const message = testMessages[langCode as keyof typeof testMessages] || testMessages['en-IN'];
        speak(message, 'medium', langCode);
      }, 500);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Main Voice Assistant Toggle */}
        <Button
          size="lg"
          onClick={toggleVoiceAssistant}
          className={`
            rounded-full 
            flex 
            items-center 
            justify-center 
            transition-all 
            duration-300 
            shadow-lg 
            scale-100 
            hover:scale-105
            border-none
            p-4 
            h-14
            w-14
          `}
          style={{
            backgroundColor: isEnabled ? '#10b981' : '#4b5563',
            color: 'white',
            boxShadow: isEnabled 
              ? '0 4px 6px -1px rgba(16, 185, 129, 0.4), 0 2px 4px -1px rgba(16, 185, 129, 0.1)'
              : '0 4px 6px -1px rgba(75, 85, 99, 0.4), 0 2px 4px -1px rgba(75, 85, 99, 0.1)'
          }}
        >
          {isEnabled ? (
            <Volume2 className="w-6 h-6 text-white" />
          ) : (
            <VolumeX className="w-6 h-6 text-white" />
          )}
        </Button>

        {/* Settings Button */}
        <Button
          size="lg"
          onClick={() => setShowSettings(true)}
          className={`
            rounded-full 
            flex 
            items-center 
            justify-center 
            transition-all 
            duration-300 
            shadow-lg 
            scale-100 
            hover:scale-105
            border-none
            p-4
            h-14
            w-14
          `}
          style={{
            backgroundColor: '#374151',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(55, 65, 81, 0.4), 0 2px 4px -1px rgba(55, 65, 81, 0.1)'
          }}
        >
          <Settings className="w-6 h-6 text-white" />
        </Button>

        {/* Current Announcement Display */}
        {isEnabled && currentAnnouncement && (
          <div className="bg-black/80 text-white text-sm px-3 py-2 rounded-lg max-w-64 mb-2 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                <Mic className="w-4 h-4 mt-0.5 text-emerald-400 animate-pulse" />
                <p className="leading-snug">{currentAnnouncement}</p>
              </div>
              <Button
                onClick={stopCurrentAnnouncement}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 h-6 w-6 p-0 ml-2"
              >
                <VolumeX className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Voice Assistant Status */}
        {isEnabled && (
          <div className="bg-emerald-500/10 backdrop-blur-sm text-emerald-700 text-xs px-2 py-1 rounded-full border border-emerald-200 flex items-center space-x-1">
            <Globe className="w-3 h-3" />
            <span>
              {supportedLanguages.find(l => l.code === selectedLanguage)?.name || 'EN'}
            </span>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Voice Assistant Settings</span>
            </DialogTitle>
            <DialogDescription>
              Configure language preferences and volume settings for voice announcements.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center space-x-2">
                        <span>{lang.name}</span>
                        <span className="text-sm text-muted-foreground">({lang.nativeName})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Volume</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Quiet</span>
                <span>Loud</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="mb-1">🗣️ <strong>Voice Features:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Real-time bus arrival announcements</li>
                <li>Traffic and weather updates</li>
                <li>Stop announcements for drivers</li>
                <li>Offline voice synthesis support</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
