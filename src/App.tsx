/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserProfile,
  ClinicalTelemetry,
  Appointment,
  TelemetryResponse,
  UiNavigationRoute,
  BadgeStatus
} from './types';

// Import modular child components
import ProfileForm from './components/ProfileForm';
import DashboardView from './components/DashboardView';
import EmergencyView from './components/EmergencyView';
import LocatorView from './components/LocatorView';
import CalendarView from './components/CalendarView';
import KnowledgeHub from './components/KnowledgeHub';
import CommunityView from './components/CommunityView';
import { ThemeToggle } from './components/ThemeToggle';
import GeminiChat from './components/GeminiChat';
import LoginView from './components/LoginView';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Icons
import {
  Heart,
  Activity,
  Compass,
  Calendar,
  BookOpen,
  ShieldAlert,
  Menu,
  X,
  Droplet,
  ChevronRight,
  ShieldCheck,
  Users,
  HeartHandshake,
  LogOut
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 1. STATE INITIALIZATION (LocalStorage Hydrated for Offline-First)
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('warrior_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Riches',
      hemoglobinType: 'HbSS',
      baselineHb: 7.5,
      baselineRetics: 12.0,
      gender: 'male',
      hasSplenomegaly: false
    };
  });

  const [telemetry, setTelemetry] = useState<ClinicalTelemetry>({
    painLevel: 2,
    temperatureCelsius: 36.8,
    bloodPressure: '115/75',
    heartRate: 72,
    oxygenSaturation: 98,
    emergencyButtonPressed: false
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('warrior_appointments');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'STOP Stroke Screening (TCD)',
        date: '2026-07-15',
        time: '09:00 AM',
        facility: 'SCD Comprehensive Care Center',
        purpose: 'Annual Transcranial Doppler (TCD) screening highly required to monitor microvascular intracranial velocities and prevent pediatric/adult stroke risk.'
      },
      {
        id: '2',
        title: 'Fetal Hemoglobin (HbF) Response Calibration',
        date: '2026-08-01',
        time: '02:30 PM',
        facility: 'Hematology Research Day Unit',
        purpose: 'Adherence audit, complete blood count (CBC) check, and Hydroxyurea dosage monitoring to ensure elevation of fetal HbF forms.'
      }
    ];
  });

  const [apiResponse, setApiResponse] = useState<TelemetryResponse>({
    greetingText: `Hello, ${profile.name}. Let's keep your HbF levels optimal today!`,
    uiNavigationRoute: UiNavigationRoute.DASHBOARD,
    globalEmergencyActive: false,
    vitalsInsightCard: {
      badgeStatus: BadgeStatus.GREEN_NORMAL,
      displaySummary: 'Vitals are stable. Continue regular hydration targets and maintain scheduled hydroxyurea calibrations.'
    },
    calendarWidget: {
      focusedEventSummary: 'Next: Transcranial Doppler (TCD) Screening on 2026-07-15.',
      hasPendingAction: true
    },
    locationService: {
      geoSearchQuery: 'Specialized Sickle Cell clinics near me',
      mapInstructionText: 'Find routine comprehensive SCD clinics near you for preventive maintenance checkups.'
    }
  });

  const [activeTab, setActiveTab] = useState<UiNavigationRoute>(UiNavigationRoute.DASHBOARD);
  const [loading, setLoading] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(prev => ({ ...prev, name: data.displayName || prev.name }));
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. STATE PERSISTENCE (Offline-First sync)
  useEffect(() => {
    localStorage.setItem('warrior_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('warrior_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // 3. TELEMETRY TRANSMISSION (Calls our backend Express State Engine)
  const handleTransmitTelemetry = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          telemetry,
          appointments
        })
      });

      if (!response.ok) throw new Error('Failed to synchronize telemetry stream.');
      const data: TelemetryResponse = await response.json();

      setApiResponse(data);

      // Deterministic navigation override if emergency is triggered
      if (data.globalEmergencyActive) {
        setActiveTab(UiNavigationRoute.EMERGENCY);
      } else if (activeTab === UiNavigationRoute.EMERGENCY && !data.globalEmergencyActive) {
        setActiveTab(UiNavigationRoute.DASHBOARD);
      }
    } catch (err) {
      console.error('API Sync Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run on initial load to calibrate with server
  useEffect(() => {
    handleTransmitTelemetry();
  }, []);

  const handleClearEmergency = () => {
    const clearedTelemetry = {
      ...telemetry,
      emergencyButtonPressed: false,
      painLevel: 2, // Reset to non-critical level
      temperatureCelsius: 36.8 // Reset to normal temperature
    };
    setTelemetry(clearedTelemetry);

    // Re-synchronize with server to return to normal dashboard route
    setTimeout(() => {
      setLoading(true);
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          telemetry: clearedTelemetry,
          appointments
        })
      })
        .then((res) => res.json())
        .then((data: TelemetryResponse) => {
          setApiResponse(data);
          setActiveTab(UiNavigationRoute.DASHBOARD);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }, 100);
  };

  const handleAddAppointment = (appt: Appointment) => {
    const updated = [appt, ...appointments].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setAppointments(updated);
    // Trigger telemetry transmit to recalculate appointment summary
    setTimeout(() => handleTransmitTelemetry(), 100);
  };

  const handleDeleteAppointment = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    setAppointments(updated);
    // Trigger telemetry transmit to recalculate appointment summary
    setTimeout(() => handleTransmitTelemetry(), 100);
  };

  // 4. EMBEDDED VIEW ROUTER
  const renderViewContent = () => {
    if (activeTab === UiNavigationRoute.EMERGENCY || apiResponse.globalEmergencyActive) {
      return (
        <EmergencyView
          profile={profile}
          telemetry={telemetry}
          apiResponse={apiResponse}
          onClearEmergency={handleClearEmergency}
        />
      );
    }

    switch (activeTab) {
      case UiNavigationRoute.DASHBOARD:
        return (
          <DashboardView
            apiResponse={apiResponse}
            profile={profile}
            telemetry={telemetry}
            onSubmitTelemetry={handleTransmitTelemetry}
            loading={loading}
          />
        );
      case UiNavigationRoute.LOCATOR:
        return <LocatorView locationData={apiResponse.locationService} />;
      case UiNavigationRoute.CALENDAR:
        return (
          <CalendarView
            appointments={appointments}
            onAddAppointment={handleAddAppointment}
            onDeleteAppointment={handleDeleteAppointment}
          />
        );
      case UiNavigationRoute.KNOWLEDGE:
        return <KnowledgeHub />;
      case UiNavigationRoute.COMMUNITY:
        return <CommunityView />;
      default:
        return (
          <DashboardView
            apiResponse={apiResponse}
            profile={profile}
            telemetry={telemetry}
            onSubmitTelemetry={handleTransmitTelemetry}
            loading={loading}
          />
        );
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 flex items-center justify-center">
        <Heart className="h-8 w-8 text-rose-500 animate-heartbeat" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col antialiased">
      {!user ? (
        <LoginView />
      ) : (
        <>
          {/* 5. GORGEOUS STICKY HEADER */}
          <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3.5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                <Heart className="h-5 w-5 fill-current text-rose-500 animate-heartbeat" />
              </span>
              <div>
                <h1 className="font-sans font-bold text-lg leading-none tracking-tight text-slate-800 dark:text-slate-100">WarriorLive</h1>
                <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider font-bold">Sickle Cell Health Optimization</p>
              </div>
            </div>

            {/* Global Emergency Status Badge in Header */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
              {apiResponse.globalEmergencyActive ? (
                <span className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase flex items-center gap-1.5 animate-pulse">
                  <ShieldAlert className="h-3.5 w-3.5" /> Emergency Mode Active
                </span>
              ) : (
                <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 px-3 py-1 rounded-full text-[10px] font-bold font-mono hidden sm:flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> System Stable
                </span>
              )}

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {[
                  { route: UiNavigationRoute.DASHBOARD, label: 'Dashboard', icon: Activity },
                  { route: UiNavigationRoute.LOCATOR, label: 'Care Locator', icon: Compass },
                  { route: UiNavigationRoute.CALENDAR, label: 'Calendar', icon: Calendar },
                  { route: UiNavigationRoute.KNOWLEDGE, label: 'Knowledge Hub', icon: BookOpen },
                  { route: UiNavigationRoute.COMMUNITY, label: 'Community', icon: Users }
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = activeTab === tab.route && !apiResponse.globalEmergencyActive;
                  return (
                    <button
                      key={tab.route}
                      onClick={() => {
                        if (apiResponse.globalEmergencyActive) return;
                        setActiveTab(tab.route);
                      }}
                      disabled={apiResponse.globalEmergencyActive}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100 dark:shadow-none'
                          : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 disabled:opacity-50'
                      }`}
                    >
                      <TabIcon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
                <button
                  onClick={() => alert('Thank you for considering a donation to support Sickle Cell warriors!')}
                  className="ml-2 px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-rose-200 dark:border-rose-800/50"
                >
                  <HeartHandshake className="h-4 w-4" />
                  <span>Donate</span>
                </button>
                <button
                  onClick={() => signOut(auth)}
                  className="ml-2 p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-200 dark:hover:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-900/30"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </nav>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 md:hidden cursor-pointer"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2 flex flex-col z-20 sticky top-[57px] shadow-sm"
          >
            {[
              { route: UiNavigationRoute.DASHBOARD, label: 'Dashboard', icon: Activity },
              { route: UiNavigationRoute.LOCATOR, label: 'Care Locator', icon: Compass },
              { route: UiNavigationRoute.CALENDAR, label: 'Calendar', icon: Calendar },
              { route: UiNavigationRoute.KNOWLEDGE, label: 'Knowledge Hub', icon: BookOpen },
              { route: UiNavigationRoute.COMMUNITY, label: 'Community', icon: Users }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.route && !apiResponse.globalEmergencyActive;
              return (
                <button
                  key={tab.route}
                  onClick={() => {
                    if (apiResponse.globalEmergencyActive) return;
                    setActiveTab(tab.route);
                    setMobileMenuOpen(false);
                  }}
                  disabled={apiResponse.globalEmergencyActive}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100 dark:shadow-none'
                      : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 disabled:opacity-50'
                  }`}
                >
                  <TabIcon className="h-4.5 w-4.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
            
            <button
              onClick={() => alert('Thank you for considering a donation to support Sickle Cell warriors!')}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all border border-rose-200 dark:border-rose-800/50 mt-2"
            >
              <HeartHandshake className="h-4.5 w-4.5" />
              <span>Donate</span>
            </button>
            
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Theme Preference</span>
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. RESPONSIVE TWO-COLUMN BENTO GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Panel: Telemetry Controls */}
        <section className="lg:col-span-4 space-y-6">
          <div className="sticky top-20">
            <ProfileForm
              profile={profile}
              telemetry={telemetry}
              onProfileChange={(updated) => setProfile({ ...profile, ...updated })}
              onTelemetryChange={(updated) => setTelemetry({ ...telemetry, ...updated })}
              onSubmitTelemetry={handleTransmitTelemetry}
              loading={loading}
            />
          </div>
        </section>

        {/* Right Content Panel: Dynamic Active Layout View */}
        <section className="lg:col-span-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-xs relative overflow-hidden flex flex-col min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (apiResponse.globalEmergencyActive ? '-emergency' : '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              {renderViewContent()}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* 7. SECURE FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 py-6 px-4 md:px-8 text-center text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <p>© 2026 WarriorLive SCD Platform. All rights reserved. De-identified HIPAA Compliance Framework.</p>
          <div className="flex gap-4 font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Edge Processing Online
            </span>
            <span>v1.0.0</span>
          </div>
        </div>
      </footer>

      {/* 8. FLOATING CLINICAL CHAT */}
      <GeminiChat />
        </>
      )}
    </div>
  );
}
