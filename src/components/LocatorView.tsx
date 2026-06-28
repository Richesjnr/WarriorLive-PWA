/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LocationService } from '../types';
import { MapPin, Search, Compass, ShieldCheck, HeartPulse, ExternalLink } from 'lucide-react';

interface LocatorViewProps {
  locationData: LocationService;
}

interface ScdCenter {
  name: string;
  type: 'ER' | 'Day Clinic' | 'Comprehensive Center';
  address: string;
  distance: string;
  phone: string;
  triageGoal: string; // e.g. "<30 mins triage analgesia"
  specialty: string;
}

const comprehensiveCenters: ScdCenter[] = [
  {
    name: 'National Sickle Cell Disease Comprehensive Care Center',
    type: 'Comprehensive Center',
    address: '100 Clinical Drive, Bethesda, MD 20892',
    distance: '1.2 miles away',
    phone: '(301) 555-0199',
    triageGoal: 'Dedicated clinical day unit + rapid triage protocols',
    specialty: 'Autologous stem cell gene-therapy center & hydroxyurea calibration.'
  },
  {
    name: 'Metropolitan Hospital Hematology Emergency Day Unit',
    type: 'Day Clinic',
    address: '450 Healthcare Ave, Suite 3B, Silver Spring, MD 20910',
    distance: '3.8 miles away',
    phone: '(301) 555-0144',
    triageGoal: 'Avoid standard ER wait; target <30 min triage analgesia',
    specialty: 'Acute VOC infusion therapies, hydration, and warming protocols.'
  },
  {
    name: 'University Health Science Center - Emergency Department',
    type: 'ER',
    address: '900 Medical Center Parkway, Washington, DC 20001',
    distance: '5.5 miles away',
    phone: '(202) 555-0122',
    triageGoal: 'Active SCD emergency protocol; target <60 min registration-to-analgesic',
    specialty: 'Equipped for Splenic Sequestration, Acute Chest Syndrome, & Aplastic Crisis.'
  }
];

export default function LocatorView({ locationData }: LocatorViewProps) {
  const [searchQuery, setSearchQuery] = useState(locationData.geoSearchQuery || 'Specialized Sickle Cell clinics near me');
  const [showStatus, setShowStatus] = useState<string>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowStatus(`Searching database for: "${searchQuery}"`);
    setTimeout(() => setShowStatus(''), 3000);
  };

  return (
    <div className="space-y-6" id="locator_view_section">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h2 className="font-sans font-bold text-2xl text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Compass className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          SCD Specialist Care Locator
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Locate specialized ER facilities, comprehensive sickle cell treatment centers, and non-emergency infusion day units.
        </p>
      </div>

      {/* Recommended Search Query Alert Banner */}
      <div className="bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-sans text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-widest">
            Telemetry Engine Search Recommendation
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
            Based on your active vitals, our state manager formatted this geo-search optimization:
          </p>
          <code className="block bg-white dark:bg-slate-900 p-2 rounded-md font-mono text-[11px] text-indigo-900 dark:text-indigo-300 mt-2 border border-indigo-100 dark:border-indigo-800/50 font-bold">
            "{locationData.geoSearchQuery}"
          </code>
          <p className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 italic mt-1.5 leading-snug">
            {locationData.mapInstructionText}
          </p>
        </div>
      </div>

      {/* Manual Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, ZIP or facility..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 dark:text-slate-100 font-medium"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer shadow-sm shadow-indigo-100 hover:shadow-md"
        >
          Search
        </button>
      </form>

      {showStatus && (
        <p className="text-xs text-slate-500 font-mono animate-pulse">{showStatus}</p>
      )}

      {/* Beautiful Interactive Map Graphic Placeholder */}
      <div className="relative h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between p-4">
        {/* Mock Map Background Grid and Markers */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(#1e1b4b 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />

        {/* Animated GPS Dot */}
        <div className="absolute top-[40%] left-[30%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <span className="absolute inline-flex h-8 w-8 rounded-full bg-indigo-600/10 animate-ping" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600" />
        </div>

        {/* Mock Markers */}
        <div className="absolute top-[30%] left-[65%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
          <MapPin className="h-5 w-5 text-red-600 animate-bounce" style={{ animationDuration: '3s' }} />
          <span className="bg-white px-1.5 py-0.5 rounded-sm border border-red-200 text-[8px] font-mono font-bold text-red-800 uppercase shadow-xs">Metropolitan Day Clinic</span>
        </div>

        <div className="absolute top-[65%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
          <MapPin className="h-5 w-5 text-emerald-600 animate-bounce" style={{ animationDuration: '4s' }} />
          <span className="bg-white px-1.5 py-0.5 rounded-sm border border-emerald-200 text-[8px] font-mono font-bold text-emerald-800 uppercase shadow-xs">SCD Care Center</span>
        </div>

        {/* Floating Controls */}
        <div className="z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-xs text-[10px] font-mono text-slate-600 dark:text-slate-300 self-start">
          GPS Active: Washington DC Region (38.9072° N, 77.0369° W)
        </div>

        <div className="z-10 bg-slate-900 text-white border border-slate-800 px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between w-full mt-auto">
          <div>
            <h4 className="font-sans font-semibold text-xs leading-none">Map View Interface Active</h4>
            <p className="text-[10px] text-slate-400 mt-1">3 specialized SCD centers found matching telemetry context.</p>
          </div>
          <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold rounded-md border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer">
            Open in Maps <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Scd Centers Listings */}
      <div className="space-y-4">
        <h3 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100 tracking-tight">
          Specialized Sickle Cell Medical Facilities Nearby
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {comprehensiveCenters.map((center, idx) => {
            const isER = center.type === 'ER';
            const isDay = center.type === 'Day Clinic';

            let badgeStyle = 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
            if (isER) badgeStyle = 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50';
            if (isDay) badgeStyle = 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';

            return (
              <div
                key={center.name}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-md transition-all shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-1">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${badgeStyle}`}>
                      {center.type}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">{center.distance}</span>
                  </div>

                  <h4 className="font-sans font-semibold text-sm text-slate-800 dark:text-slate-200 tracking-tight leading-snug">
                    {center.name}
                  </h4>

                  <p className="text-slate-500 dark:text-slate-400 text-[11px] font-mono leading-tight">
                    {center.address}
                  </p>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <p className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                      <HeartPulse className="h-3 w-3 shrink-0 text-red-500" />
                      <span>{center.triageGoal}</span>
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 italic leading-normal pl-4">
                      {center.specialty}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-400 dark:text-slate-500">Phone: {center.phone}</span>
                  <a
                    href={`tel:${center.phone.replace(/[^0-9]/g, '')}`}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
