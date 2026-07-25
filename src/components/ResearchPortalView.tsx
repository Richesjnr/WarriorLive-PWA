import React from 'react';
import { Microscope, FileSearch, ShieldCheck, ChevronRight, Activity, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

export default function ResearchPortalView({ profile }: { profile: UserProfile }) {
  const trials = [
    { title: 'CRISPR Gene Editing for HbSS Patients', sponsor: 'Vertex Therapeutics', phase: 'Phase 3', match: 98, distance: 'Lagos Teaching Hospital (12mi)' },
    { title: 'Novel Fetal Hemoglobin Inducers', sponsor: 'Global Blood Therapeutics', phase: 'Phase 2b', match: 85, distance: 'Remote / Tele-monitored' },
    { title: 'Long-term outcomes of early Hydroxyurea', sponsor: 'WHO SCD Initiative', phase: 'Observational', match: 100, distance: 'Data-only participation' }
  ];

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
          <Microscope className="h-6 w-6 text-indigo-500" />
          Clinical Research Portal
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Opt-in to clinical trial matching and help advance SCD treatments with your real-world evidence.
        </p>
      </header>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-indigo-900 dark:text-indigo-300">Data Privacy & Consent</h3>
          </div>
          <p className="text-sm text-indigo-800/80 dark:text-indigo-200/80 leading-relaxed">
            Your data is strictly de-identified before matching. You retain full control over what is shared and can revoke access at any time. Partner organizations operate under strict ethical protocols.
          </p>
        </div>
        <div className="shrink-0">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2 cursor-pointer">
            Manage Consent Preferences <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 pt-2">Recommended Trials for {profile.hemoglobinType}</h3>
      
      <div className="space-y-4">
        {trials.map((trial, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.01 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold font-mono rounded-md uppercase tracking-wider">
                    {trial.match}% Match
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold font-mono rounded-md uppercase tracking-wider">
                    {trial.phase}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {trial.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Sponsor: {trial.sponsor}</p>
              </div>
              
              <div className="flex flex-col justify-between items-start md:items-end gap-3 md:border-l border-slate-100 dark:border-slate-800 md:pl-6">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-slate-400" />
                  {trial.distance}
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer">
                  View Details <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
