import React, { useState, useRef } from 'react';
import { User, Shield, UploadCloud, ChevronRight, Activity, FileText, CheckCircle, LogIn, UserPlus } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export type UserRole = 'patient' | 'professional' | 'admin';
export type AuthStatus = 'authenticated' | 'guest' | 'pending_verification';

interface OnboardingProps {
  onComplete: (role: UserRole, status: AuthStatus) => void;
}

export default function OnboardingView({ onComplete }: OnboardingProps) {
  const [activeRole, setActiveRole] = useState<'patient' | 'professional'>('patient');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [npiNumber, setNpiNumber] = useState('');
  const [institution, setInstitution] = useState('');
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setLicenseFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (authMode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      if (activeRole === 'patient') {
        onComplete('patient', 'authenticated');
      } else {
        onComplete('professional', 'pending_verification');
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    onComplete('patient', 'guest');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center bg-indigo-600 relative">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-sans text-white mb-2">WarriorLive</h1>
          <p className="text-indigo-100 text-sm">Clinical-Grade SCD Optimization Platform</p>
        </div>

        <div className="p-8 pt-6">
          {/* Auth Mode Toggle */}
          <div className="flex justify-center mb-6">
             <div className="flex bg-slate-100 dark:bg-slate-900 rounded-full p-1 border border-slate-200 dark:border-slate-700">
               <button
                 className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                   authMode === 'login'
                     ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                     : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                 }`}
                 onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
               >
                 <LogIn className="h-3 w-3" /> Log In
               </button>
               <button
                 className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                   authMode === 'signup'
                     ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                     : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                 }`}
                 onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
               >
                 <UserPlus className="h-3 w-3" /> Create Account
               </button>
             </div>
          </div>

          {/* Role Toggle */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-6">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeRole === 'patient'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              onClick={() => setActiveRole('patient')}
            >
              <User className="h-4 w-4" />
              Warrior
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeRole === 'professional'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              onClick={() => setActiveRole('professional')}
            >
              <Shield className="h-4 w-4" />
              Professional
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg dark:bg-red-900/30 dark:border-red-800">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeRole === 'professional' && authMode === 'signup' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
                    placeholder="Dr. Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">NPI / Registration Number</label>
                  <input
                    type="text"
                    required
                    value={npiNumber}
                    onChange={(e) => setNpiNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono dark:text-white"
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Institution</label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
                    placeholder="General Hospital"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:outline-none dark:text-white ${
                  activeRole === 'professional' ? 'focus:ring-emerald-500' : 'focus:ring-indigo-500'
                }`}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:outline-none dark:text-white ${
                  activeRole === 'professional' ? 'focus:ring-emerald-500' : 'focus:ring-indigo-500'
                }`}
                placeholder="••••••••"
              />
            </div>

            {activeRole === 'professional' && authMode === 'signup' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Medical License Upload</label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-900/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {licenseFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="h-8 w-8 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{licenseFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <UploadCloud className="h-8 w-8 text-slate-400" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">Drag & drop license document, or click to browse</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 space-y-3 pb-8">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                } ${
                  activeRole === 'professional'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                }`}
              >
                {loading ? 'Processing...' : (authMode === 'login' ? 'Log In' : (activeRole === 'professional' ? 'Submit Registration' : 'Create Account'))}
                {!loading && <ChevronRight className="h-4 w-4" />}
              </button>

              {activeRole === 'patient' && (
                <button
                  type="button"
                  onClick={handleGuestMode}
                  className="w-full py-3 px-4 rounded-xl text-indigo-700 dark:text-indigo-300 font-bold text-sm border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all flex items-center justify-center gap-2"
                >
                  Track Crisis Instantly (Guest Mode)
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
