'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const ADMIN_CREDENTIALS = {
  email: 'admin@smilecare.com',
  password: '123456789'
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@smilecare.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simple token-based authentication
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('adminEmail', email);
        toast.success('Welcome back, Admin!');
        router.push('/admin/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-navy-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-navy-100">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="font-display text-3xl font-bold text-navy-700 mb-2">Admin Portal</h1>
          <p className="text-slate-500">Sign in to manage your clinic</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-card border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-navy-500 focus:ring-4 focus:ring-navy-500/10 outline-none transition-all"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-navy-500 focus:ring-4 focus:ring-navy-500/10 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-navy-600 hover:bg-navy-700 disabled:opacity-70 text-white font-bold rounded-2xl shadow-xl shadow-navy-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Only authorized clinic staff should access this area.
              <br />
              Secure environment • HIPAA Compliant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
