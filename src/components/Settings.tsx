import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Settings as SettingsIcon, 
  User, 
  Phone, 
  Plus, 
  Trash2, 
  Volume2, 
  Globe, 
  Shield,
  X,
  Save,
  Edit
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'passenger' | 'driver';
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export function Settings({ isOpen, onClose, userRole }: SettingsProps) {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [volume, setVolume] = useState(0.8);
  const [showAddContact, setShowAddContact] = useState(false);

  const supportedLanguages: LanguageOption[] = [
    { code: 'en-IN', name: 'English', nativeName: 'English (India)' },
    { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
  ];

  const relationshipOptions = [
    'Family Member',
    'Spouse',
    'Parent',
    'Sibling',
    'Friend',
    'Colleague',
    'Emergency Contact',
    'Other'
  ];

  // Load settings from localStorage
  useEffect(() => {
    const savedContacts = localStorage.getItem('emergencyContacts');
    const savedVoiceEnabled = localStorage.getItem('voiceAssistantEnabled');
    const savedLanguage = localStorage.getItem('voiceLanguage');
    const savedVolume = localStorage.getItem('voiceVolume');

    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts));
    }
    if (savedVoiceEnabled) {
      setVoiceEnabled(JSON.parse(savedVoiceEnabled));
    }
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
    localStorage.setItem('voiceAssistantEnabled', JSON.stringify(voiceEnabled));
    localStorage.setItem('voiceLanguage', selectedLanguage);
    localStorage.setItem('voiceVolume', volume.toString());
  };

  useEffect(() => {
    saveSettings();
  }, [emergencyContacts, voiceEnabled, selectedLanguage, volume]);

  const addEmergencyContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Please fill in both name and phone number');
      return;
    }

    // Validate phone number (basic check)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(newContact.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact,
      relationship: newContact.relationship || 'Emergency Contact'
    };

    setEmergencyContacts([...emergencyContacts, contact]);
    setNewContact({ name: '', phone: '', relationship: '' });
    setShowAddContact(false);
    toast.success('Emergency contact added successfully');
  };

  const removeEmergencyContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
    toast.success('Emergency contact removed');
  };

  const updateEmergencyContact = (id: string, updatedContact: Partial<EmergencyContact>) => {
    setEmergencyContacts(emergencyContacts.map(contact => 
      contact.id === id ? { ...contact, ...updatedContact } : contact
    ));
    setEditingContact(null);
    toast.success('Emergency contact updated');
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    const langName = supportedLanguages.find(l => l.code === langCode)?.name || 'English';
    toast.success(`Language changed to ${langName}`);
  };

  const handleVoiceToggle = (enabled: boolean) => {
    setVoiceEnabled(enabled);
    toast.success(enabled ? 'Voice assistant enabled' : 'Voice assistant disabled');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-lg">
            <SettingsIcon className="w-5 h-5 text-cyan-600" />
            <span>Settings</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Emergency Contacts Section */}
          <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Shield className="w-5 h-5 text-red-500" />
                <span>Emergency Contacts</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {emergencyContacts.length} contacts
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {emergencyContacts.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No emergency contacts added yet</p>
                  <p className="text-xs mt-1">Add contacts for SOS alerts</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {emergencyContacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-cyan-200 hover:shadow-sm transition-shadow"
                    >
                      {editingContact === contact.id ? (
                        <div className="flex-1 space-y-2">
                          <Input
                            defaultValue={contact.name}
                            placeholder="Name"
                            onBlur={(e) => updateEmergencyContact(contact.id, { name: e.target.value })}
                            className="h-8"
                          />
                          <Input
                            defaultValue={contact.phone}
                            placeholder="Phone"
                            onBlur={(e) => updateEmergencyContact(contact.id, { phone: e.target.value })}
                            className="h-8"
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-cyan-600" />
                            <span className="font-medium">{contact.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {contact.relationship}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{contact.phone}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingContact(editingContact === contact.id ? null : contact.id)}
                          className="h-8 w-8 p-0"
                        >
                          {editingContact === contact.id ? (
                            <Save className="w-3 h-3" />
                          ) : (
                            <Edit className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEmergencyContact(contact.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showAddContact ? (
                <div className="border-t pt-3 space-y-3">
                  <h4 className="font-medium text-sm">Add New Contact</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="Contact name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      className="h-9"
                    />
                    <Input
                      placeholder="Phone number"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      className="h-9"
                    />
                    <Select value={newContact.relationship} onValueChange={(value) => setNewContact({ ...newContact, relationship: value })}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={addEmergencyContact} className="flex-1 h-9 bg-cyan-600 hover:bg-cyan-700">
                      <Save className="w-4 h-4 mr-1" />
                      Save Contact
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddContact(false)} className="h-9">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAddContact(true)}
                  variant="outline"
                  className="w-full h-10 border-dashed border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Emergency Contact
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Voice Assistant Settings - Only for Passengers */}
          {userRole === 'passenger' && (
            <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Volume2 className="w-5 h-5 text-teal-600" />
                  <span>Voice Assistant</span>
                  <Badge variant={voiceEnabled ? "default" : "secondary"} className={voiceEnabled ? "bg-teal-500" : ""}>
                    {voiceEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Enable Voice Assistant</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Get audio updates about bus arrivals and stops
                    </p>
                  </div>
                  <Switch
                    checked={voiceEnabled}
                    onCheckedChange={handleVoiceToggle}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Language</span>
                  </Label>
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

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Volume Level</Label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Quiet</span>
                      <span>{Math.round(volume * 100)}%</span>
                      <span>Loud</span>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                  <p className="text-xs text-teal-800 mb-2">
                    <strong>Voice Features:</strong>
                  </p>
                  <ul className="text-xs text-teal-700 space-y-1">
                    <li>• Real-time bus arrival announcements</li>
                    <li>• Traffic and weather updates</li>
                    <li>• Destination alerts</li>
                    <li>• Multilingual support</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* App Information */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-slate-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">About BusTracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Version:</strong> 2.1.0</p>
                <p><strong>Role:</strong> {userRole === 'passenger' ? 'Passenger' : 'Driver'}</p>
                <p><strong>Theme:</strong> Cool Blue Modern</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800 mb-1">
                  <strong>Smart Tracking, Smarter Travel</strong>
                </p>
                <p className="text-xs text-blue-700">
                  Modern bus tracking with AI-enhanced predictions and multilingual support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} className="bg-cyan-600 hover:bg-cyan-700">
            <Save className="w-4 h-4 mr-2" />
            Save & Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
