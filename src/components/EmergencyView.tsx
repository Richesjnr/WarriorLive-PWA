/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, ClinicalTelemetry, TelemetryResponse } from '../types';
import { ShieldAlert, AlertCircle, HeartPulse, ShieldCheck, Phone, CheckCircle, Clock } from 'lucide-react';

interface EmergencyViewProps {
  profile: UserProfile;
  telemetry: ClinicalTelemetry;
  apiResponse: TelemetryResponse;
  onClearEmergency: () => void;
}

export default function EmergencyView({ profile, telemetry, apiResponse, onClearEmergency }: EmergencyViewProps) {
  const [triageSeconds, setTriageSeconds] = useState(1800); // 30 minutes in seconds
  const [registerSeconds, setRegisterSeconds] = useState(3600); // 60 minutes in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTriageSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setRegisterSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6" id="emergency_state_container">
      {/* Red Alert Header banner */}
      <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 flex items-start gap-4 shadow-sm animate-pulse-subtle">
        <ShieldAlert className="h-8 w-8 text-red-700 dark:text-red-500 shrink-0 mt-0.5 animate-bounce" style={{ animationDuration: '2s' }} />
        <div className="space-y-1.5 flex-1">
          <h2 className="font-sans font-bold text-xl text-red-950 dark:text-red-400 tracking-tight flex items-center gap-2">
            Clinical Safety State: CRITICAL_RED_OVERRIDE
          </h2>
          <p className="text-red-900 dark:text-red-300 text-sm font-medium">
            {apiResponse.greetingText || `Critical safety limits breached. We have activated standard emergency care protocols.`}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {telemetry.emergencyButtonPressed && (
              <span className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                Manual Emergency Triggered
              </span>
            )}
            {telemetry.painLevel >= 7 && (
              <span className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                Severe Pain Crisis: {telemetry.painLevel}/10
              </span>
            )}
            {telemetry.temperatureCelsius >= 38.3 && (
              <span className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                Severe Pyrexia: {telemetry.temperatureCelsius}°C
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Triage Countdown Clocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Triage analgesic target */}
        <div className="bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-900/30 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-red-800 dark:text-red-400">
              <Clock className="h-4 w-4" />
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest">Triage-to-Analgesic Limit</h4>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Standard goal for initial clinical assessment and IV drug access.</p>
            <p className="font-mono text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">{formatTime(triageSeconds)}</p>
          </div>
          <span className="h-12 w-12 rounded-full border-4 border-red-100 dark:border-red-900/50 border-t-red-600 dark:border-t-red-500 animate-spin shrink-0" />
        </div>

        {/* Registration analgesic target */}
        <div className="bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-900/30 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-red-800 dark:text-red-400">
              <Clock className="h-4 w-4" />
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest">Registration-to-Analgesic Limit</h4>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Absolute clinical window for actual delivery of analgesic doses.</p>
            <p className="font-mono text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">{formatTime(registerSeconds)}</p>
          </div>
          <span className="h-12 w-12 rounded-full border-4 border-red-100 dark:border-red-900/50 border-t-red-600 dark:border-t-red-500 animate-spin shrink-0" style={{ animationDuration: '1.5s' }} />
        </div>
      </div>

      {/* ER Emergency Care Card Component (Present to Triage Staff) */}
      <div className="border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md">
        <div className="bg-slate-900 dark:bg-black text-white p-4 flex justify-between items-center">
          <div>
            <h3 className="font-sans font-bold text-sm tracking-wide uppercase text-white">WarriorLive clinical Emergency Card</h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">HIPAA-Compliant Patient Care Reference</p>
          </div>
          <span className="bg-red-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm animate-pulse">
            SCD RAPID TRIAGE REQUESTED
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 space-y-5">
          {/* Patient Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 font-mono text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block uppercase">Patient Name</span>
              <strong className="text-slate-900 dark:text-slate-100 text-sm leading-none block mt-1">{profile.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase">SCD Genotype</span>
              <strong className="text-slate-900 dark:text-slate-100 text-sm leading-none block mt-1">{profile.hemoglobinType}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase">Baseline Hb</span>
              <strong className="text-slate-900 dark:text-slate-100 text-sm leading-none block mt-1">{profile.baselineHb} g/dL</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase">Baseline Retics</span>
              <strong className="text-slate-900 dark:text-slate-100 text-sm leading-none block mt-1">{profile.baselineRetics}%</strong>
            </div>
          </div>

          {/* Clinician Instructions block */}
          <div className="space-y-3 bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
            <h4 className="font-sans font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
              Evidence-Based Clinical Directives (Mangla et al., 2023)
            </h4>
            <div className="text-slate-700 dark:text-slate-300 text-xs space-y-2 leading-relaxed">
              <p>
                <strong>1. RAPID ANALGESIA:</strong> Initiate parenteral opioid therapy (e.g., subcutaneous/intravenous morphine or hydromorphone) immediately. Triage goal is within 30 minutes of registration. Re-assess pain every 15-30 minutes.
              </p>
              <p>
                <strong>2. BLACKLIST / CONTRAINDICATION:</strong> <span className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 px-1 font-bold rounded-xs">MEPERIDINE (DEMEROL) IS CONTRAINDICATED</span> due to the elevated risk of accumulation of normeperidine inducing severe neurotoxicity, tremulousness, and generalized seizures.
              </p>
              <p>
                <strong>3. INFECTION SAFETY (Asplenia):</strong> Patients with SCD exhibit functional asplenia. Body temperature <span className="font-bold">≥ 38.3°C (101°F)</span> constitutes a severe medical emergency. Obtain blood cultures and initiate empiric broad-spectrum intravenous antibiotic coverage (e.g. Ceftriaxone) immediately without delay.
              </p>
              <p>
                <strong>4. HYDRATION & OXYGEN:</strong> Administer intravenous hydration matching baseline maintenance fluids. Do NOT hyperhydrate. Administer supplemental oxygen <span className="font-bold">ONLY</span> if room-air oxygen saturation drops below <span className="font-bold">95%</span> to avoid suppression of erythropoiesis.
              </p>
            </div>
          </div>

          {/* Red Flag Organs alert */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
              <h5 className="font-sans font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wide">Acute Chest Syndrome (ACS)</h5>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Monitor for rapid respiratory rate, productive cough, localized thoracic pain, or sudden drop in O₂ saturation. Request prompt chest radiograph.
              </p>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
              <h5 className="font-sans font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wide">Splenic Sequestration</h5>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Check for sudden pallor, abdominal distension, left upper quadrant splenamegaly, or a drop in Hemoglobin &gt; 2 g/dL below baseline. High hypovolemic shock risk.
              </p>
            </div>
          </div>
        </div>

        {/* Footer controls inside Emergency Card */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-3 justify-between items-center">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
            <span>WarriorLive Emergency Schema Active</span>
          </div>
          <button
            onClick={onClearEmergency}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Acknowledge & Exit Override
          </button>
        </div>
      </div>

      {/* Care Locator and Emergency Contact helper */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="font-sans font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <HeartPulse className="h-5 w-5 text-red-600 dark:text-red-500" />
          Immediate Action Checklist
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs text-slate-600 dark:text-slate-400 list-none pl-0">
          <li className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <div>
              <strong className="block text-slate-950 dark:text-slate-200">Call 911</strong>
              <span>If breathing is labored, chest pain increases, or level of consciousness changes.</span>
            </div>
          </li>
          <li className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <ShieldCheck className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <div>
              <strong className="block text-slate-950 dark:text-slate-200">Pack SCD Protocol</strong>
              <span>Keep your medical papers and this open Emergency Card ready on your mobile.</span>
            </div>
          </li>
          <li className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <CheckCircle className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <div>
              <strong className="block text-slate-950 dark:text-slate-200">Hydrate Immediately</strong>
              <span>Drink 2 glasses of warm water if tolerated to reduce blood viscosity while en-route.</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
