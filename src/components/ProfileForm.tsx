/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile, ClinicalTelemetry } from '../types';
import { ShieldAlert, User, Activity, AlertTriangle, Save, HeartPulse, RefreshCw } from 'lucide-react';

interface ProfileFormProps {
  profile: UserProfile;
  telemetry: ClinicalTelemetry;
  onProfileChange: (p: Partial<UserProfile>) => void;
  onTelemetryChange: (t: Partial<ClinicalTelemetry>) => void;
  onSubmitTelemetry: () => void;
  loading: boolean;
}

export default function ProfileForm({
  profile,
  telemetry,
  onProfileChange,
  onTelemetryChange,
  onSubmitTelemetry,
  loading
}: ProfileFormProps) {

  const getPainColor = (level: number) => {
    if (level < 4) return 'bg-emerald-500 dark:bg-emerald-600';
    if (level < 7) return 'bg-amber-500 dark:bg-amber-600';
    return 'bg-rose-600 dark:bg-rose-700 animate-pulse';
  };

  const getTempColor = (temp: number) => {
    if (temp < 37.5) return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800/50';
    if (temp < 38.3) return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800/50';
    return 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800/50 animate-pulse';
  };

  return (
    <div className="space-y-6" id="telemetry_profile_form">
      {/* Profile Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
          <User className="h-4.5 w-4.5 text-indigo-500" />
          Warrior Profile
        </h3>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => onProfileChange({ name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium text-slate-800 dark:text-slate-100"
              placeholder="e.g., Riches"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Genotype</label>
              <select
                value={profile.hemoglobinType}
                onChange={(e) => onProfileChange({ hemoglobinType: e.target.value as any })}
                className="w-full px-2.5 py-2 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium text-slate-800 dark:text-slate-100"
              >
                <option value="HbSS">HbSS (Homozygous)</option>
                <option value="HbSC">HbSC (Retinopathy risk)</option>
                <option value="HbSB0">HbSβ⁰ (Severe Beta-thal)</option>
                <option value="HbSB+">HbSβ⁺ (Mild Beta-thal)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gender</label>
              <select
                value={profile.gender}
                onChange={(e) => onProfileChange({ gender: e.target.value as any })}
                className="w-full px-2.5 py-2 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium text-slate-800 dark:text-slate-100"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Baseline Hb (g/dL)</label>
              <input
                type="number"
                step="0.1"
                value={profile.baselineHb}
                onChange={(e) => onProfileChange({ baselineHb: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono font-medium text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Baseline Retics %</label>
              <input
                type="number"
                step="0.1"
                value={profile.baselineRetics}
                onChange={(e) => onProfileChange({ baselineRetics: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono font-medium text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Emergency Contact Name</label>
              <input
                type="text"
                value={profile.emergencyContactName || ''}
                onChange={(e) => onProfileChange({ emergencyContactName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium text-slate-800 dark:text-slate-100"
                placeholder="Name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Emergency Phone</label>
              <input
                type="tel"
                value={profile.emergencyContactPhone || ''}
                onChange={(e) => onProfileChange({ emergencyContactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono font-medium text-slate-800 dark:text-slate-100"
                placeholder="Phone"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Telemetry Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Activity className="h-4.5 w-4.5 text-indigo-500" />
          Clinical Telemetry Stream
        </h3>

        <div className="space-y-4">
          {/* Pain Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pain Level (VAS Score)</span>
              <span className={`px-2.5 py-0.5 font-mono text-xs font-bold text-white rounded-md ${getPainColor(telemetry.painLevel)}`}>
                {telemetry.painLevel}/10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={telemetry.painLevel}
              onChange={(e) => onTelemetryChange({ painLevel: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-400 dark:text-slate-500">
              <span>0 (None)</span>
              <span>4 (Mod)</span>
              <span>7 (Sev)</span>
              <span>10 (Max)</span>
            </div>
          </div>

          {/* Temperature */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Body Temp (°C)</label>
              {telemetry.temperatureCelsius >= 38.3 && (
                <span className="text-[9px] font-bold text-red-600 flex items-center gap-0.5 font-mono animate-pulse">
                  <AlertTriangle className="h-3 w-3" /> INFECTIOUS RISK
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                min="35"
                max="42"
                value={telemetry.temperatureCelsius}
                onChange={(e) => onTelemetryChange({ temperatureCelsius: Number(e.target.value) })}
                className="flex-1 px-3 py-2 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 dark:text-slate-100"
              />
              <span className={`px-3 py-2 border rounded-lg text-xs font-mono flex items-center justify-center font-bold ${getTempColor(telemetry.temperatureCelsius)}`}>
                {((telemetry.temperatureCelsius * 9/5) + 32).toFixed(1)}°F
              </span>
            </div>
          </div>

          {/* Blood pressure & O2 Saturation */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Blood Pressure</label>
              <input
                type="text"
                value={telemetry.bloodPressure}
                onChange={(e) => onTelemetryChange({ bloodPressure: e.target.value })}
                placeholder="e.g., 115/75"
                className="w-full px-3 py-2 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SpO₂ Oxygen %</label>
              <input
                type="number"
                min="50"
                max="100"
                value={telemetry.oxygenSaturation || 98}
                onChange={(e) => onTelemetryChange({ oxygenSaturation: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Core Telemetry Submit buttons */}
          <div className="pt-2 space-y-3">
            <button
              onClick={onSubmitTelemetry}
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shadow-indigo-100 hover:shadow-md"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Evaluating Telemetry...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Transmit Vitals Stream</span>
                </>
              )}
            </button>

            {/* Huge Red Panic override trigger - matches design specs */}
            <button
              onClick={() => {
                onTelemetryChange({ emergencyButtonPressed: true });
                // Instantly submit with true state
                setTimeout(() => onSubmitTelemetry(), 100);
              }}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-lg shadow-red-200 dark:shadow-none uppercase text-xs tracking-widest ring-4 ring-red-50 dark:ring-red-900/30 hover:shadow-red-300 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <HeartPulse className="h-4.5 w-4.5 animate-pulse" />
              <span>Emergency SOS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
