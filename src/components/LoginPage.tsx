import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Bus, Shield, Lock, Phone, Mail, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LoginPageProps {
  onLogin: (role: 'passenger' | 'driver') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<'passenger' | 'driver'>('passenger');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      onLogin(selectedRole);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white rounded-full blur-lg animate-pulse delay-500"></div>
      </div>

      <div className="min-h-screen flex flex-col relative z-10 px-4 py-8">
        {/* Branding Header */}
        <div className="text-center text-white space-y-4 mb-8 pt-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <Bus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-white font-semibold">BusTracker</h1>
              <Badge variant="secondary" className="mt-1 bg-white/20 text-white border-white/30 text-xs">
                Smart Tracking, Smarter Travel
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2 px-4">
            <h2 className="text-lg text-white/90">Real-time bus tracking</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Track buses in real-time and never miss your ride again.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-6 mt-6">
            <div className="flex items-center space-x-2 text-white/80">
              <MapPin className="w-4 h-4" />
              <span className="text-xs">Live GPS</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <Shield className="w-4 h-4" />
              <span className="text-xs">Secure</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-sm bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center space-x-2 mb-4">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span className="text-lg">Secure Login</span>
              </CardTitle>
              
              {/* Role Selection */}
              <div className="flex space-x-2 mb-4">
                <Button
                  type="button"
                  variant={selectedRole === 'passenger' ? 'default' : 'outline'}
                  onClick={() => setSelectedRole('passenger')}
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                >
                  Passenger
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === 'driver' ? 'default' : 'outline'}
                  onClick={() => setSelectedRole('driver')}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                >
                  Driver
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs value={isLogin ? 'login' : 'signup'} onValueChange={(v) => setIsLogin(v === 'login')}>
                <TabsList className="grid w-full grid-cols-2 mb-6 h-10">
                  <TabsTrigger value="login" className="text-sm">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="text-sm">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Auth Method Selection */}
                    <div className="flex space-x-2 mb-4">
                      <Button
                        type="button"
                        variant={authMethod === 'email' ? 'default' : 'outline'}
                        onClick={() => setAuthMethod('email')}
                        className="flex-1 h-10"
                        size="sm"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                      <Button
                        type="button"
                        variant={authMethod === 'phone' ? 'default' : 'outline'}
                        onClick={() => setAuthMethod('phone')}
                        className="flex-1 h-10"
                        size="sm"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Phone
                      </Button>
                    </div>

                    <Input
                      type={authMethod === 'email' ? 'email' : 'tel'}
                      placeholder={authMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
                      required
                      className="h-12"
                    />
                    
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      required
                      className="h-12"
                    />

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 transform active:scale-95"
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : `Login as ${selectedRole}`}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Full Name"
                      required
                      className="h-12"
                    />
                    
                    <Input
                      type="email"
                      placeholder="Email Address"
                      required
                      className="h-12"
                    />
                    
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      className="h-12"
                    />
                    
                    <Input
                      type="password"
                      placeholder="Create Password"
                      required
                      className="h-12"
                    />

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 transform active:scale-95"
                      disabled={loading}
                    >
                      {loading ? 'Creating account...' : `Sign up as ${selectedRole}`}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center">
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  <Shield className="w-3 h-3 mr-1" />
                  Your data is encrypted and secure
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom illustration hint */}
        <div className="text-center pb-8 px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 inline-block">
            <Bus className="w-6 h-6 text-white/60 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}