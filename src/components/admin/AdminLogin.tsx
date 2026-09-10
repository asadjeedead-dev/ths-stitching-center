import React, { useState } from 'react';
import { ASSETS } from '../../data/initialData';
import { authenticateAdmin } from '../../services/auth';
import { AdminUser } from '../../types';
import { Lock, Mail, ShieldCheck, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToPublic: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToPublic }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await authenticateAdmin(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.');
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('admin@ths.com');
    setPassword('admin123');
    setError('');
    setIsLoading(true);
    try {
      const user = await authenticateAdmin('admin@ths.com', 'admin123');
      onLoginSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none"></div>

      {/* Back button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </button>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#eff4ff] border border-emerald-100 flex items-center justify-center mx-auto p-2 shadow-xs">
              <img
                src={ASSETS.logo}
                alt="THS Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-serif text-[#0b1c30]">
                Admin & Staff Portal
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Taleem-o-Hunar Society — Stitching Center Management
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ths.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-center text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'Signing In...' : 'Sign In to Management'}</span>
            </button>
          </form>

          {/* Quick Demo Login Preset */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition flex items-center justify-center gap-2 border border-emerald-200 disabled:opacity-50"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#166534]" />
              <span>1-Click Quick Demo Login (Zahra Malik)</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Default credentials: <code className="text-slate-600 font-semibold">admin@ths.com</code> / <code className="text-slate-600 font-semibold">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
