import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Shield, CheckCircle2, Ticket, Calendar, Sparkles } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Profile Greeting */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-indigo-600/30">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{user?.name}</h1>
              {user?.isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Terverifikasi
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="glass-card px-4 py-2.5 rounded-2xl text-left">
            <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tipe Akun</span>
            <span className="text-sm font-bold text-indigo-300 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-400" />
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Stats & Quick Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
            <Ticket className="w-5 h-5" />
          </div>
          <span className="block text-2xl font-black text-white">0 Tiket</span>
          <span className="text-xs text-slate-400">Tiket Aktif yang Siap Digunakan</span>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="block text-2xl font-black text-white">0 Event</span>
          <span className="text-xs text-slate-400">Event Disimpan di Bookmark</span>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="block text-2xl font-black text-white">Aktif</span>
          <span className="text-xs text-slate-400">Status Keanggotaan Platform</span>
        </div>
      </div>

      {/* Recent Ticket Purchases Placeholder */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Tiket Saya & QR Pass</h2>
          <span className="text-xs font-semibold text-indigo-400 cursor-pointer hover:underline">Lihat Semua</span>
        </div>

        <div className="glass-card p-10 rounded-2xl text-center space-y-4 border border-dashed border-slate-800">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-500">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Belum Ada Tiket Acara</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Anda belum membeli tiket event apa pun. Jelajahi berbagai konser & seminar di halaman utama.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
