import React from 'react';
import { QrCode, FileText, Activity, Shield, Download, Droplet } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

export default function HealthPassportView({ profile }: { profile: UserProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <header className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h2 className="text-2xl font-bold font-sans text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Shield className="h-6 w-6 text-indigo-500" />
          Digital Health Passport
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          A portable, shareable digital health record accessible globally.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-indigo-900 rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Shield className="w-24 h-24" />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl mb-4 shadow-xl">
                <QrCode className="w-32 h-32 text-indigo-900" />
              </div>
              <h3 className="text-xl font-bold font-sans mb-1">{profile.name}</h3>
              <p className="text-indigo-200 font-mono text-sm tracking-wider uppercase">{profile.hemoglobinType} Genotype</p>
              
              <div className="mt-6 w-full flex gap-2">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <Download className="w-4 h-4" /> Export PDF
                </motion.button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" /> Key Metrics
            </h4>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Baseline Hb</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{profile.baselineHb} g/dL</span>
              </li>
              <li className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Baseline Retics</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{profile.baselineRetics}%</span>
              </li>
              <li className="flex justify-between items-center text-sm pb-1">
                <span className="text-slate-500 dark:text-slate-400">Splenomegaly</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{profile.hasSplenomegaly ? 'Yes' : 'No'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" /> Crisis & Hospitalization Log
            </h4>
            <div className="space-y-4">
              {[
                { date: '2026-06-12', type: 'Vaso-Occlusive Crisis', location: 'Lagos University Teaching Hospital', duration: '4 days' },
                { date: '2025-11-03', type: 'Acute Chest Syndrome', location: 'General Hospital', duration: '7 days' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="p-3 bg-red-100 text-red-600 rounded-xl h-fit">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{log.type}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Location: {log.location}</p>
                    <div className="flex gap-4 mt-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      <span>Date: {log.date}</span>
                      <span>Duration: {log.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-indigo-500" /> Transfusion Records
            </h4>
            <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
              <p className="text-slate-500 dark:text-slate-400 text-sm">No recent blood transfusions logged.</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-semibold transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/50 cursor-pointer">
                + Log Transfusion
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
