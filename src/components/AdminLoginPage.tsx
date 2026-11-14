import { FormEvent, useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react';
import { JamiaSiteConfig } from '../types/jamia';

interface AdminLoginPageProps {
  siteConfig: JamiaSiteConfig;
  onLoginSuccess: (email: string) => void;
  onBackToWebsite: () => void;
}

export function AdminLoginPage({
  siteConfig,
  onLoginSuccess,
  onBackToWebsite,
}: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password.trim()) {
      setError('براہِ کرم ای میل اور پاس ورڈ دونوں درج کریں۔');
      return;
    }
    if (
      (cleanEmail === siteConfig.email.toLowerCase() || cleanEmail === 'admin@jamia.edu') &&
      password === 'jamia786'
    ) {
      setError('');
      onLoginSuccess(email.trim());
      return;
    }
    setError('ای میل یا پاس ورڈ درست نہیں ہے۔ ڈیمو تفصیلات نیچے درج ہیں۔');
  };

  const fillDemo = () => {
    setEmail(siteConfig.email);
    setPassword('jamia786');
    setError('');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 py-10">
      <div className="w-full max-w-md border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-[#0F294A] text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#0F294A]">ایڈمن پورٹل لاگ ان</h1>
              <p className="text-xs text-slate-500">{siteConfig.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBackToWebsite}
            className="inline-flex cursor-pointer items-center gap-1 border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            <span>ویب سائٹ</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          {error && (
            <div className="border border-red-200 bg-red-50 px-3 py-2.5 font-medium text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block font-semibold text-slate-800">ای میل ایڈریس</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Jamiatulbinnat786@gmail.com"
                className="h-10 w-full border border-slate-300 bg-white pr-9 pl-3 text-left font-mono-num text-xs text-slate-900 focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-semibold text-slate-800">پاس ورڈ</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPass ? 'text' : 'password'}
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10 w-full border border-slate-300 bg-white pr-9 pl-9 text-left font-mono-num text-xs text-slate-900 focus:border-[#2563EB] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                aria-label="پاس ورڈ دکھائیں یا چھپائیں"
                className="absolute top-1/2 left-2.5 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-700"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 bg-[#0F294A] text-sm font-bold text-white transition-colors hover:bg-[#193B68]"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>ایڈمن پینل کھولیں</span>
          </button>
        </form>

        {/* Prototype Demo Credentials Box */}
        <div className="mt-6 border border-slate-200 bg-slate-50 p-3.5 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-[#0F294A]">ڈیمو ایڈمن لاگ ان تفصیلات</span>
            <button
              type="button"
              onClick={fillDemo}
              className="cursor-pointer bg-[#2563EB] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#1D4ED8]"
            >
              خودکار پُر کریں
            </button>
          </div>
          <div className="mt-2 space-y-1 text-slate-600" dir="ltr">
            <p className="font-mono-num">
              Email: <span className="font-semibold text-slate-900">{siteConfig.email}</span>
            </p>
            <p className="font-mono-num">
              Password: <span className="font-semibold text-slate-900">jamia786</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
