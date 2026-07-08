import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { ShoppingBag, Lock, Mail, UserPlus, LogIn, AlertCircle } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
  addToast: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function Auth({ onAuthSuccess, addToast }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      addToast('Supabase is not configured yet. Using mock guest mode.', 'warning');
      onAuthSuccess({ email: 'guest@example.com', id: 'guest-id' });
      return;
    }

    setLoading(true);
    setError(null);

    const trimmedEmail = email.trim();

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
        });

        if (signUpError) throw signUpError;

        addToast('Sign up successful! You can now log in or check your email.', 'success');
        setIsSignUp(false);
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          addToast(`Welcome back, ${data.user.email}!`, 'success');
          onAuthSuccess(data.user);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication.');
      addToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper to prefill account options for testing family accounts
  const prefillAccount = (familyRole: string) => {
    const domain = window.location.hostname || 'example.com';
    const emailMap: Record<string, string> = {
      dad: `dad@family.com`,
      mom: `mom@family.com`,
      kid: `kid@family.com`,
    };
    setEmail(emailMap[familyRole]);
    setPassword('family123');
    addToast(`Pre-filled login details for ${familyRole}! Click "Sign In" or "Sign Up" if not created yet.`, 'info');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Family Grocery List
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {isSignUp ? 'Create a family member account' : 'Sign in to access your shared list'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-zinc-900 py-8 px-6 shadow-xl border border-zinc-100 dark:border-zinc-800 rounded-3xl space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-rose-700 dark:text-rose-300 font-medium">
                {error}
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleAuth}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@family.com"
                  className="block w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="block w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-150 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Processing...</span>
              ) : isSignUp ? (
                <span className="flex items-center gap-2"><UserPlus className="w-4 h-4" /> Create Account</span>
              ) : (
                <span className="flex items-center gap-2"><LogIn className="w-4 h-4" /> Sign In</span>
              )}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-100 dark:border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-zinc-400 dark:text-zinc-500 text-xs font-semibold uppercase tracking-widest">Or</span>
            <div className="flex-grow border-t border-zinc-100 dark:border-zinc-800"></div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 cursor-pointer"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have family accounts yet? Sign Up"}
            </button>
          </div>

          {/* Quick Family Prefill Panel */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
            <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 justify-center">
              Family Accounts Quick-Prefill
            </h4>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => prefillAccount('dad')}
                className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                Dad
              </button>
              <button
                onClick={() => prefillAccount('mom')}
                className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                Mom
              </button>
              <button
                onClick={() => prefillAccount('kid')}
                className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                Kid
              </button>
            </div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center leading-normal">
              Pre-fill convenient family test emails. Note: passwords default to <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-600 dark:text-zinc-400">family123</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
