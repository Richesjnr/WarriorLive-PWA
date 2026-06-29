/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LocationService } from '../types';
import { MapPin, Search, Compass, ShieldCheck, HeartPulse, ExternalLink } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function PlaceSearch({ query, location }: { query: string, location: google.maps.LatLngLiteral | null }) {
  const placesLib = useMapsLibrary('places');
  const map = useMap();
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);

  useEffect(() => {
    if (!placesLib || !query) return;
    placesLib.Place.searchByText({
      textQuery: query,
      fields: ['displayName', 'location', 'formattedAddress'],
      locationBias: location || map?.getCenter(),
      maxResultCount: 8,
    }).then(({ places }) => {
      setPlaces(places);
      if (places.length > 0 && map && places[0].location) {
          map.panTo(places[0].location);
      }
    });
  }, [placesLib, query, map, location]);

  return (
    <>
      {places.map(p => (
        <AdvancedMarker key={p.id} position={p.location as google.maps.LatLng} title={p.displayName || ''}>
            <Pin background="#ef4444" glyphColor="#fff" borderColor="#b91c1c" />
        </AdvancedMarker>
      ))}
    </>
  );
}

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
  const [activeQuery, setActiveQuery] = useState(locationData.geoSearchQuery || 'Specialized Sickle Cell clinics near me');
  const [showStatus, setShowStatus] = useState<string>('');
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error", error);
        }
      );
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowStatus(`Searching database for: "${searchQuery}"`);
    setActiveQuery(searchQuery);
    setTimeout(() => setShowStatus(''), 3000);
  };

  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="text-center max-w-md">
          <Compass className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Google Maps API Key Required</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">To enable real-time tracking and clinic discovery, please add your Google Maps Platform key.</p>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl text-left text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
             <ol className="list-decimal pl-5 space-y-2">
                <li>Open Settings (⚙️ top-right)</li>
                <li>Go to Secrets</li>
                <li>Add <code>GOOGLE_MAPS_PLATFORM_KEY</code></li>
             </ol>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Beautiful Interactive Map Graphic */}
      <div className="relative h-[400px] bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between shadow-inner">
         <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={userLocation || { lat: 38.9072, lng: -77.0369 }}
              defaultZoom={userLocation ? 12 : 10}
              mapId="SCD_CLINIC_LOCATOR"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              {userLocation && (
                  <AdvancedMarker position={userLocation} title="Your Location">
                     <div className="bg-indigo-600 text-white p-1.5 rounded-full border-2 border-white shadow-lg animate-pulse">
                         <MapPin className="h-4 w-4" />
                     </div>
                  </AdvancedMarker>
              )}
              <PlaceSearch query={activeQuery} location={userLocation} />
            </Map>
         </APIProvider>

        {/* Floating Controls */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 text-white border border-slate-800 px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between gap-4">
          <div>
            <h4 className="font-sans font-semibold text-xs leading-none">Map View Interface Active</h4>
            <p className="text-[10px] text-slate-400 mt-1">Live places search active.</p>
          </div>
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
