import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { PassengerDashboard } from './components/PassengerDashboard';
import { DriverDashboard } from './components/DriverDashboard';
import { Toaster } from './components/ui/sonner';

type UserRole = 'passenger' | 'driver' | null;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole;
    if (savedRole) {
      setUserRole(savedRole);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem('userRole', role);
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('userRole');
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading BusTracker...</p>
        </div>
      </div>
    );
  }

  // Render based on authentication state and role
  if (!userRole) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      {userRole === 'passenger' ? (
        <PassengerDashboard onLogout={handleLogout} />
      ) : (
        <DriverDashboard onLogout={handleLogout} />
      )}
      <Toaster />
    </>
  );
}
