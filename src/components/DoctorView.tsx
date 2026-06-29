import React, { useState } from 'react';
import { UserProfile, ClinicalTelemetry } from '../types';
import { Users, Activity, FileText, Search, UserCheck, AlertTriangle, MessageSquare, ChevronRight, BarChart2 } from 'lucide-react';

export default function DoctorView() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for the doctor's patient roster
  const patients = [
    { id: '1', name: 'Riches', age: 24, hemoglobinType: 'HbSS', status: 'critical', lastSeen: 'Today', nextAppt: 'N/A' },
    { id: '2', name: 'Alicia M.', age: 19, hemoglobinType: 'HbSC', status: 'stable', lastSeen: '2 days ago', nextAppt: 'Aug 1, 2026' },
    { id: '3', name: 'Marcus T.', age: 31, hemoglobinType: 'HbSS', status: 'monitoring', lastSeen: '1 week ago', nextAppt: 'Jul 15, 2026' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-6">
        <h2 className="text-2xl font-bold font-sans text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <UserCheck className="h-6 w-6 text-indigo-500" />
          Clinical Provider Dashboard
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your Warrior roster, monitor clinical telemetry, and optimize SCD care pathways.</p>
      </header>

      {/* High-Level Clinic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
            <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Warriors</p>
            <p className="text-2xl font-bold font-mono">142</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-xl">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Active Crises</p>
            <p className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">3</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
            <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Stable Routine</p>
            <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">128</p>
          </div>
        </div>
      </div>

      {/* Patient Roster */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-bold font-sans text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <FileText className="h-5 w-5 text-indigo-500" /> Active Patient Roster
          </h3>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {patients.map((p) => (
            <div key={p.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-10 rounded-full ${p.status === 'critical' ? 'bg-red-500' : p.status === 'monitoring' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold font-sans text-slate-800 dark:text-slate-100">{p.name}</p>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full font-mono">{p.hemoglobinType}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Age: {p.age} • Last Vitals: {p.lastSeen}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="hidden sm:inline">Next Appt: {p.nextAppt}</span>
                <button className="ml-2 p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 flex items-center gap-1 text-xs font-semibold cursor-pointer">
                  View Chart <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button className="p-4 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl flex items-center gap-4 transition-colors cursor-pointer text-left">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-indigo-600 dark:text-indigo-400">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-300">Message Broadcast</h4>
            <p className="text-xs text-indigo-700/70 dark:text-indigo-400/70">Send care updates to patients</p>
          </div>
        </button>
        <button className="p-4 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl flex items-center gap-4 transition-colors cursor-pointer text-left">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-emerald-600 dark:text-emerald-400">
            <BarChart2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">Population Health Analytics</h4>
            <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">Review HbF compliance trends</p>
          </div>
        </button>
      </div>
    </div>
  );
}
