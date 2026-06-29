import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { EmailAuthProvider, linkWithCredential, User } from 'firebase/auth';
import { ShieldAlert, Loader2, Mail, Lock, UserPlus, CheckCircle2 } from 'lucide-react';

export default function AccountUpgrade({ user }: { user: User }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credential = EmailAuthProvider.credential(email, password);
      await linkWithCredential(user, credential);
      setSuccess(true);
    } catch (err: any) {
      console.error("Account upgrade error:", err);
      let friendlyError = err.message || 'An error occurred during account upgrade.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'This email is already in use. You cannot link to an existing account.';
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'Password must be at least 6 characters.';
      }
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  if (!user.isAnonymous) return null;

  if (success) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 shadow-sm mt-6">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-2">
          <CheckCircle2 className="h-5 w-5" />
          Account Upgraded successfully!
        </div>
        <p className="text-xs text-emerald-600 dark:text-emerald-500">
          Your health data is now permanently secured and accessible across devices.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5 space-y-4 shadow-sm mt-6">
      <div className="flex gap-3">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg shrink-0 h-fit">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-sans font-bold text-sm text-amber-800 dark:text-amber-400 tracking-tight">Guest Mode Active</h3>
          <p className="text-[11px] font-medium text-amber-700/80 dark:text-amber-500/80 leading-relaxed mt-1">
            You are currently using WarriorLive as a guest. Create a free account to permanently save your symptom logs and telemetry data.
          </p>
        </div>
      </div>

      <form onSubmit={handleUpgrade} className="space-y-3 pt-2">
        {error && (
          <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[11px] font-medium border border-red-100 dark:border-red-800/50">
            {error}
          </div>
        )}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800 dark:text-slate-100 placeholder-slate-400"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Create Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800 dark:text-slate-100 placeholder-slate-400"
              placeholder="Min. 6 characters"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-4 py-2 text-xs font-bold shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-colors"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          <span>Save Account</span>
        </button>
      </form>
    </div>
  );
}
