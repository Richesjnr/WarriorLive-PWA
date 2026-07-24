import React, { useState } from 'react';
import { UserProfile, ClinicalTelemetry } from '../types';
import { Users, Activity, FileText, Search, UserCheck, AlertTriangle, MessageSquare, ChevronRight, BarChart2, ArrowLeft, HeartPulse, Thermometer, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// Assuming recharts is installed based on standard requirements
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DoctorView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Mock data for the doctor's patient roster
  const patients = [
    { id: '1', name: 'Riches', age: 24, hemoglobinType: 'HbSS', status: 'critical', lastSeen: 'Today', nextAppt: 'N/A' },
    { id: '2', name: 'Alicia M.', age: 19, hemoglobinType: 'HbSC', status: 'stable', lastSeen: '2 days ago', nextAppt: 'Aug 1, 2026' },
    { id: '3', name: 'Marcus T.', age: 31, hemoglobinType: 'HbSS', status: 'monitoring', lastSeen: '1 week ago', nextAppt: 'Jul 15, 2026' }
  ];

  // Mock chart data
  const chartData = [
    { name: 'Mon', painLevel: 3, temp: 37.1 },
    { name: 'Tue', painLevel: 4, temp: 37.2 },
    { name: 'Wed', painLevel: 2, temp: 36.9 },
    { name: 'Thu', painLevel: 5, temp: 37.5 },
    { name: 'Fri', painLevel: 8, temp: 38.4 },
    { name: 'Sat', painLevel: 7, temp: 38.1 },
    { name: 'Sun', painLevel: 4, temp: 37.3 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <header className="mb-6">
        <h2 className="text-2xl font-bold font-sans text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <UserCheck className="h-6 w-6 text-indigo-500" />
          Clinical Provider Dashboard
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your Warrior roster, monitor clinical telemetry, and optimize SCD care pathways.</p>
      </header>

      <AnimatePresence mode="wait">
        {selectedPatient ? (
          <motion.div 
            key="chart-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedPatient(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer text-slate-500"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    {selectedPatient.name}'s Chart
                    <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full font-mono">{selectedPatient.hemoglobinType}</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Age: {selectedPatient.age} • Status: {selectedPatient.status}</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer"
              >
                Send Message
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl"><HeartPulse className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Pain Trend</p>
                  <p className="text-xl font-bold font-mono">Elevated</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex items-center gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><Thermometer className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Latest Temp</p>
                  <p className="text-xl font-bold font-mono">38.4°C</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Droplets className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Hydration</p>
                  <p className="text-xl font-bold font-mono">Suboptimal</p>
                </div>
              </div>
            </div>

            <div className="h-72 w-full mt-4">
              <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-4 font-sans text-sm">7-Day Vitals Trend</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 10]} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[36, 40]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="painLevel" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Pain Level (0-10)" />
                  <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Temperature (°C)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* High-Level Clinic Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div whileHover={{ y: -2 }} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                  <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Warriors</p>
                  <p className="text-2xl font-bold font-mono">142</p>
                </div>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Active Crises</p>
                  <p className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">3</p>
                </div>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                  <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Stable Routine</p>
                  <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">128</p>
                </div>
              </motion.div>
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
                  <motion.div 
                    key={p.id} 
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                    className="p-4 transition-colors flex flex-col sm:flex-row justify-between gap-4 sm:items-center dark:hover:bg-slate-800/80 cursor-default"
                  >
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
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPatient(p)}
                        className="ml-2 p-2 bg-white hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 flex items-center gap-1 text-xs font-semibold cursor-pointer shadow-sm"
                      >
                        View Chart <ChevronRight className="h-3 w-3" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsMessageSent(true);
                  setTimeout(() => setIsMessageSent(false), 3000);
                }}
                className="p-4 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl flex items-center gap-4 transition-colors cursor-pointer text-left shadow-sm"
              >
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-indigo-600 dark:text-indigo-400 relative overflow-hidden">
                  <AnimatePresence>
                    {isMessageSent && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute inset-0 bg-emerald-500 text-white flex items-center justify-center rounded-xl"
                      >
                        <Activity className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-300">
                    {isMessageSent ? 'Broadcast Sent!' : 'Message Broadcast'}
                  </h4>
                  <p className="text-xs text-indigo-700/70 dark:text-indigo-400/70">
                    {isMessageSent ? 'Updates delivered to 142 warriors.' : 'Send care updates to patients'}
                  </p>
                </div>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl flex items-center gap-4 transition-colors cursor-pointer text-left shadow-sm"
              >
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-emerald-600 dark:text-emerald-400">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">Population Health Analytics</h4>
                  <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">Review HbF compliance trends</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
