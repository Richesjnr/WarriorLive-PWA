import React from 'react';
import { ShieldAlert, Clock, LogOut } from 'lucide-react';

interface VerificationPendingViewProps {
  onLogout: () => void;
}

export default function VerificationPendingView({ onLogout }: VerificationPendingViewProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-center p-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-full border-8 border-amber-100 dark:border-amber-900/50">
            <ShieldAlert className="h-12 w-12 text-amber-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold font-sans text-slate-800 dark:text-white mb-3">Verification Pending</h2>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
          Your license credentials are under manual review to ensure patient safety and HIPAA compliance. 
          Access to patient records will be granted within 24 hours.
        </p>
        
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-center gap-3 mb-8">
          <Clock className="h-5 w-5 text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Estimated time: &lt; 24h</span>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full py-3 px-4 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
