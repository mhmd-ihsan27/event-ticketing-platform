import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Silakan isi semua kolom');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Berhasil masuk! Selamat datang kembali.');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal masuk. Periksa email dan password Anda.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10 border border-slate-700/60">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Selamat Datang Kembali</h2>
          <p className="text-xs sm:text-sm text-slate-400">Masuk ke akun Anda untuk mengakses tiket digital & event</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Alamat Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="nama@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full glass-input rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">Kata Sandi</label>
              <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                Lupa Password?
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full glass-input rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-btn py-3.5 rounded-xl font-bold text-sm text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Belum punya akun?{' '}
            <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300 underline">
              Daftar akun gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
