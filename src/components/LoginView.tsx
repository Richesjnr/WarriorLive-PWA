import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInAnonymously } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Heart, Loader2, ShieldCheck, AlertCircle, CheckCircle2, User } from 'lucide-react';

export default function LoginView() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      console.error("Anonymous auth error:", err);
      let friendlyError = err.message || 'An error occurred during guest login.';
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {
        friendlyError = 'Anonymous sign-in is not enabled in Firebase Console.';
      }
      setError(friendlyError);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update Firebase Auth display name directly (resilient first line of defense)
        try {
          await updateProfile(userCredential.user, {
            displayName: displayName
          });
        } catch (updateErr) {
          console.warn("Auth profile display name update failed:", updateErr);
        }

        // Create user profile document in Firestore as a second step
        try {
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: userCredential.user.email,
            displayName: displayName,
            createdAt: new Date().toISOString()
          });
        } catch (firestoreErr: any) {
          console.warn("Firestore profile creation skipped or failed (will use LocalStorage fallback):", firestoreErr);
          // We do not fail the login flow if Firestore document writing fails due to rules or setup!
          // This fixes the "auth issue" for regular users if their database writes are blocked.
        }
        
        setSuccessMsg("Account registered successfully! Welcome.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let friendlyError = err.message || 'An error occurred during authentication.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        friendlyError = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'This email address is already registered.';
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'Password must be at least 6 characters.';
      } else if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {
        friendlyError = 'This sign-in method is not enabled in Firebase Console.';
      }
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  // Helper to pre-fill admin details for testing
  const handlePrefillAdmin = () => {
    setEmail('richesjr24@gmail.com');
    setPassword('admin123456'); // Standard password or let admin fill in their password
    setIsSignUp(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        <div className="text-center mb-8 flex flex-col items-center">
          <span className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 inline-block mb-4">
            <Heart className="h-8 w-8 fill-current text-rose-500 animate-heartbeat" />
          </span>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            WarriorLive Sickle Cell Health Optimization
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-slate-100 outline-none"
                placeholder="Jane Doe"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-slate-100 outline-none"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-slate-100 outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs border border-red-100 dark:border-red-800/50 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs border border-emerald-100 dark:border-emerald-800/50 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3 text-sm font-bold shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-colors"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            <User className="h-4 w-4" />
            <span>Continue as Guest</span>
          </button>

          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMsg(''); }}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>

          <button
            onClick={handlePrefillAdmin}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors"
            title="Pre-fill Admin details for convenient setup"
          >
            <ShieldCheck className="h-3 w-3" />
            <span>Administrator Access Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
