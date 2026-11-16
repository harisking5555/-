import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, GraduationCap, ShieldCheck } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AdminLoginPageProps {
  onLoginSuccess: (email: string) => void;
  onBackToWebsite: () => void;
}

export function AdminLoginPage({ onLoginSuccess, onBackToWebsite }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      onLoginSuccess(credential.user.email || cleanEmail);
    } catch (err: unknown) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code: string }).code)
          : '';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-email'
      ) {
        setError('Invalid email address or password.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Sign-in failed. Please verify your email and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="ltr" className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md border border-slate-200 border-t-4 border-t-[#0F294A] bg-white p-6 shadow-md sm:p-8"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-[#0F294A] text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#0F294A]">Admin Portal Login</h1>
              <p className="text-xs text-slate-500">Markazi Jamia tul Banat Kasur</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBackToWebsite}
            className="inline-flex cursor-pointer items-center gap-1 border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Website</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          {error && (
            <div className="border border-red-200 bg-red-50 px-3 py-2.5 font-medium text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block font-semibold text-slate-800">Email Address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email address"
                className="h-10 w-full border border-slate-300 bg-white pr-3 pl-9 font-mono-num text-xs text-slate-900 focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-semibold text-slate-800">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                required
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-10 w-full border border-slate-300 bg-white pr-9 pl-9 font-mono-num text-xs text-slate-900 focus:border-[#2563EB] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                aria-label="Toggle password visibility"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-700"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 bg-[#0F294A] text-sm font-bold text-white transition-colors hover:bg-[#193B68] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{loading ? 'Signing In...' : 'Sign In to Admin Panel'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
