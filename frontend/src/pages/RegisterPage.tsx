import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Silakan isi semua kolom pendaftaran.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    if (password.length < 8) {
      toast.error('Kata sandi minimal 8 karakter');
      return;
    }

    setLoading(true);
    try {
      const res = await register(name, email, password);
      toast.success('Pendaftaran berhasil! Silakan masukkan kode OTP yang dikirim ke email Anda.');
      navigate(`/verify-email?email=${encodeURIComponent(res.email)}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal mendaftar. Silakan coba lagi.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10 border border-slate-700/60">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 text-purple-400 mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Buat Akun Baru</h2>
          <p className="text-xs sm:text-sm text-slate-400">Daftar dalam 1 menit untuk jelajah & beli tiket event</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Nama Lengkap</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Contoh: Budi Pratama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full glass-input rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none"
              />
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

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
            <label className="block text-xs font-semibold text-slate-300">Kata Sandi (Minimal 8 Karakter)</label>
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

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Konfirmasi Kata Sandi</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            className="w-full gradient-btn py-3.5 rounded-xl font-bold text-sm text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Daftar & Kirim Kode OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300 underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
