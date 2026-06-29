/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TelemetryResponse, UserProfile, ClinicalTelemetry } from '../types';
import { ShieldCheck, AlertTriangle, ShieldAlert, Droplet, Thermometer, Activity, RefreshCw, BarChart2, BookOpen, Pill, CheckCircle2, Heart, Wind } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardViewProps {
  apiResponse: TelemetryResponse;
  profile: UserProfile;
  telemetry: ClinicalTelemetry;
  onSubmitTelemetry: () => void;
  loading: boolean;
}

export default function DashboardView({ apiResponse, profile, telemetry, onSubmitTelemetry, loading }: DashboardViewProps) {
  const isNormal = apiResponse.vitalsInsightCard.badgeStatus === 'GREEN_NORMAL';
  const isWarn = apiResponse.vitalsInsightCard.badgeStatus === 'ORANGE_WARN';

  // Hydration state with localStorage persistence
  const [hydrationGlasses, setHydrationGlasses] = useState<number>(() => {
    const saved = localStorage.getItem('warriorlive_hydration');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lastHydrationTime, setLastHydrationTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('warriorlive_last_hydration');
    return saved ? parseInt(saved, 10) : null;
  });

  const [needsHydrationAlert, setNeedsHydrationAlert] = useState(false);

  // Medication states
  const [medsTaken, setMedsTaken] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem('warriorlive_meds');
    return saved ? JSON.parse(saved) : { hydroxyurea: false, folicAcid: false };
  });

  const [weatherData, setWeatherData] = useState<{ temp: number; isExtreme: boolean } | null>(null);

  useEffect(() => {
    localStorage.setItem('warriorlive_hydration', hydrationGlasses.toString());
  }, [hydrationGlasses]);

  useEffect(() => {
    const checkHydration = () => {
      if (lastHydrationTime) {
        const hoursSince = (Date.now() - lastHydrationTime) / (1000 * 60 * 60);
        setNeedsHydrationAlert(hoursSince >= 4);
      } else {
        setNeedsHydrationAlert(true);
      }
    };
    checkHydration();
    const interval = setInterval(checkHydration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastHydrationTime]);

  const handleAddGlass = () => {
    setHydrationGlasses(prev => prev + 1);
    const now = Date.now();
    setLastHydrationTime(now);
    localStorage.setItem('warriorlive_last_hydration', now.toString());
  };

  useEffect(() => {
    localStorage.setItem('warriorlive_meds', JSON.stringify(medsTaken));
  }, [medsTaken]);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather?latitude=38.9072&longitude=-77.0369');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.current_weather) {
          const tempC = data.current_weather.temperature;
          const isExtreme = tempC < 10 || tempC > 32;
          setWeatherData({ temp: tempC, isExtreme });
        }
      } catch (err) {
        console.warn("Failed to fetch weather", err);
      }
    }
    fetchWeather();
  }, []);

  // Dynamic status badges
  const getBadgeIcon = () => {
    if (isNormal) return <ShieldCheck className="h-5 w-5 text-emerald-700" />;
    if (isWarn) return <AlertTriangle className="h-5 w-5 text-amber-700" />;
    return <ShieldAlert className="h-5 w-5 text-rose-700" />;
  };

  const getBadgeStyle = () => {
    if (isNormal) return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
    if (isWarn) return 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
    return 'bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-800/50';
  };

  // Mock 7-day data for charts
  const sevenDayData = [
    { day: 'Mon', pain: 2, temp: 36.6, hr: 82, o2: 99 },
    { day: 'Tue', pain: 4, temp: 37.1, hr: 88, o2: 98 },
    { day: 'Wed', pain: 3, temp: 36.8, hr: 85, o2: 98 },
    { day: 'Thu', pain: 1, temp: 36.5, hr: 80, o2: 100 },
    { day: 'Fri', pain: 5, temp: 37.5, hr: 95, o2: 97 },
    { day: 'Sat', pain: 6, temp: 38.0, hr: 102, o2: 95 },
    { day: 'Sun', pain: Number(telemetry.painLevel) || 2, temp: Number(telemetry.temperatureCelsius) || 36.7, hr: Number(telemetry.heartRate) || 85, o2: Number(telemetry.oxygenSaturation) || 98 },
  ];

  return (
    <div className="space-y-6" id="dashboard_view_section">
      {/* Greetings Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="font-sans font-bold text-2xl text-slate-800 dark:text-slate-100 tracking-tight leading-none">
            {apiResponse.greetingText || `Hello, ${profile.name}`}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Real-time disease-state calibration and telemetry synthesis.
          </p>
        </div>
        <button
          onClick={onSubmitTelemetry}
          disabled={loading}
          className="p-2 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          title="Recalculate Vitals Insight"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Weather Alert Banner */}
      {weatherData && weatherData.isExtreme && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <Thermometer className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h4 className="font-sans font-bold text-sm text-amber-800 dark:text-amber-400 uppercase tracking-widest">
              Weather Alert: Extreme Temperature
            </h4>
            <p className="text-amber-700 dark:text-amber-300 text-xs mt-1 leading-relaxed">
              Local temperature is {weatherData.temp}°C. Extreme temperatures can trigger Vaso-Occlusive Crises. Please dress appropriately, avoid prolonged exposure, and stay hydrated.
            </p>
          </div>
        </div>
      )}

      {/* Hydration Alert Banner */}
      {needsHydrationAlert && (
        <div className="bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800/50 rounded-xl p-4 flex items-start gap-3 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 animate-pulse"></div>
          <Droplet className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5 animate-bounce" />
          <div>
            <h4 className="font-sans font-bold text-sm text-cyan-800 dark:text-cyan-400 uppercase tracking-widest">
              Hydration Reminder
            </h4>
            <p className="text-cyan-700 dark:text-cyan-300 text-xs mt-1 leading-relaxed">
              It's been over 4 hours since your last logged glass of water. Staying hydrated is critical to preventing crises.
            </p>
          </div>
        </div>
      )}

      {/* Clinical Telemetry Summary Card */}
      <div className={`border rounded-2xl p-6 space-y-4 shadow-sm transition-colors duration-300 ${getBadgeStyle()}`}>
        <div className="flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-wider">
          {getBadgeIcon()}
          <span>SCD Telemetry Status: {apiResponse.vitalsInsightCard.badgeStatus}</span>
        </div>

        <p className="font-sans text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
          Clinical Assessment Summary
        </p>

        <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-300 font-medium whitespace-pre-wrap">
          {apiResponse.vitalsInsightCard.displaySummary}
        </p>

        {/* Actionable hydration tips and genotype warnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="bg-white/60 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200/40 dark:border-slate-700 text-[11px] text-slate-800 dark:text-slate-300 flex items-start gap-2">
            <Droplet className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block font-semibold text-slate-900 dark:text-slate-100">Aggressive Hydration Goal</strong>
              <span>Target 3 to 4 liters (12-16 glasses) of warm fluids daily. Reduces blood viscosity to inhibit vaso-occlusion.</span>
            </div>
          </div>
          <div className="bg-white/60 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200/40 dark:border-slate-700 text-[11px] text-slate-800 dark:text-slate-300 flex items-start gap-2">
            <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block font-semibold text-slate-900 dark:text-slate-100">Genotype Considerations</strong>
              {profile.hemoglobinType === 'HbSS' ? (
                <span>SS genotypes carry elevated visco-occlusive and ACS risks. Adhere strictly to Hydroxyurea therapy.</span>
              ) : (
                <span>SC genotypes carry higher risks of Proliferative Sickle Retinopathy. Prioritize retinal checkups.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Affirmation Card from design instructions */}
      <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Daily Affirmation</p>
          <h3 className="text-lg font-serif leading-relaxed italic">
            "You are stronger than the pain. Today is a journey, and we are tracking every step together."
          </h3>
          <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-indigo-100">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span>Oxygen Saturation: {telemetry.oxygenSaturation || 98}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span>Clinical Guidance: Active</span>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-800/40 rounded-full"></div>
      </div>

      {/* Daily Hydration Tracker */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="font-sans font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Droplet className="h-4 w-4 text-cyan-500" />
            Daily Hydration Tracker
          </h4>
          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
            Target: 12 Glasses (3L)
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
              <span>{hydrationGlasses} glasses logged</span>
              <span>{(hydrationGlasses * 250 / 1000).toFixed(1)} L / 3.0 L</span>
            </div>
            {/* Progress Bar */}
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-500 transition-all duration-500 ease-out"
                style={{ width: `${Math.min((hydrationGlasses / 12) * 100, 100)}%` }}
              />
            </div>
            {hydrationGlasses >= 12 && (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wide flex items-center gap-1 mt-1">
                <ShieldCheck className="h-3 w-3" /> Goal Achieved - Hydration Optimized
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setHydrationGlasses(prev => Math.max(0, prev - 1))}
              className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-500 transition-colors cursor-pointer"
              title="Remove one glass"
            >
              -
            </button>
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800/50">
              <Droplet className={`h-6 w-6 text-cyan-500 ${hydrationGlasses < 12 ? 'animate-pulse' : ''}`} />
            </div>
            <button
              onClick={handleAddGlass}
              className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 hover:border-cyan-200 dark:hover:border-cyan-800/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
              title="Add one glass (250ml)"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Daily Medication Tracker */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="font-sans font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Pill className="h-4 w-4 text-purple-500" />
            Daily Medication & Supplements
          </h4>
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
            Resets at midnight
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border transition-colors ${medsTaken.hydroxyurea ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                {medsTaken.hydroxyurea ? <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> : <Pill className="h-5 w-5 text-slate-400 dark:text-slate-500" />}
              </div>
              <div>
                <h5 className="font-sans font-semibold text-sm text-slate-800 dark:text-slate-200">Hydroxyurea</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Prescription • Reduces VOCs & ACS</p>
              </div>
            </div>
            <button
              onClick={() => setMedsTaken(prev => ({ ...prev, hydroxyurea: !prev.hydroxyurea }))}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${medsTaken.hydroxyurea ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'}`}
            >
              {medsTaken.hydroxyurea ? 'Logged' : 'Log Dose'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border transition-colors ${medsTaken.folicAcid ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                {medsTaken.folicAcid ? <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> : <Pill className="h-5 w-5 text-slate-400 dark:text-slate-500" />}
              </div>
              <div>
                <h5 className="font-sans font-semibold text-sm text-slate-800 dark:text-slate-200">Folic Acid / Supplements</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Supports new red blood cell production</p>
              </div>
            </div>
            <button
              onClick={() => setMedsTaken(prev => ({ ...prev, folicAcid: !prev.folicAcid }))}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${medsTaken.folicAcid ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'}`}
            >
              {medsTaken.folicAcid ? 'Logged' : 'Log Dose'}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Clinical Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pain Trend Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="font-sans font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-red-500" />
              Historic Pain Severity (VAS)
            </h4>
            <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">7 Days</span>
          </div>
          <div className="h-40 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sevenDayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={20} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                  itemStyle={{ color: '#ef4444' }}
                />
                <Line type="monotone" dataKey="pain" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temperature Trend Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="font-sans font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Thermometer className="h-4 w-4 text-amber-500" />
              Body Temperature Trend (°C)
            </h4>
            <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">7 Days</span>
          </div>
          <div className="h-40 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sevenDayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[35, 42]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={25} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                  itemStyle={{ color: '#f59e0b' }}
                />
                <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heart Rate Trend Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="font-sans font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-rose-500" />
              Heart Rate Trend (BPM)
            </h4>
            <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">7 Days</span>
          </div>
          <div className="h-40 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sevenDayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[60, 120]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={25} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                  itemStyle={{ color: '#f43f5e' }}
                />
                <Line type="monotone" dataKey="hr" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#f43f5e', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Oxygen Saturation Trend Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="font-sans font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Wind className="h-4 w-4 text-cyan-500" />
              Oxygen Saturation (SpO2 %)
            </h4>
            <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">7 Days</span>
          </div>
          <div className="h-40 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sevenDayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={25} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Line type="monotone" dataKey="o2" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Appointment Summary Widget */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
        <h4 className="font-sans font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
          <BarChart2 className="h-4 w-4 text-indigo-500" />
          Active Calendar Summary
        </h4>
        <div className="space-y-1">
          <p className="text-slate-800 dark:text-slate-200 text-xs font-semibold">
            {apiResponse.calendarWidget.focusedEventSummary || 'No upcoming scheduled events found.'}
          </p>
          {apiResponse.calendarWidget.hasPendingAction && (
            <span className="inline-block mt-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 text-[10px] font-mono px-2 py-0.5 rounded">
              Action Required: Review preparation checklist for upcoming hematology visit.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
