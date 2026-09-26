import React, { useState } from 'react';
import { Calendar, MapPin, Ticket, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const EventDetailPage: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<'regular' | 'vip'>('regular');
  const [quantity, setQuantity] = useState(1);

  const handleBooking = () => {
    toast.success(`Berhasil memesan ${quantity} tiket ${selectedTicket.toUpperCase()}! Melanjutkan ke pembayaran...`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Event Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel h-80 sm:h-[420px] border border-slate-700/80">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&auto=format&fit=crop&q=80"
          alt="Event Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-600/80 backdrop-blur-md text-xs font-bold text-white uppercase tracking-wider">
              Teknologi & AI
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              IndoTech Summit 2026: The Future of Artificial Intelligence
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-indigo-400" /> 15 Oktober 2026</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-indigo-400" /> 09:00 - 17:00 WIB</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-indigo-400" /> JCC Senayan, Jakarta</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Description & Purchasing Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Event Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-8 rounded-3xl space-y-4 border border-slate-800">
            <h2 className="text-xl font-bold text-white">Deskripsi Event</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              IndoTech Summit 2026 menghadirkan konferensi teknologi terbesar tahun ini di Indonesia! Dihadiri oleh lebih dari 20+ pembicara internasional dan pakar AI global untuk membahas tren Generative AI, Cyber Security, dan Masa Depan Cloud Engineering.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Setiap peserta akan mendapatkan E-Certificate resmi, Networking Lunch, akses ke Demo Booth Startup terdepan, serta E-Ticket digital bersistem QR Code aman.
            </p>
          </div>

          {/* Speaker / Organizer Info */}
          <div className="glass-panel p-8 rounded-3xl space-y-4 border border-slate-800">
            <h2 className="text-xl font-bold text-white">Penyelenggara Acara</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400">
                TM
              </div>
              <div>
                <h4 className="text-base font-bold text-white">TechAsia Media Network</h4>
                <p className="text-xs text-slate-400">Penyelenggara Konferensi Teknologi & Startup Indonesia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Ticket Booking Widget */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-indigo-500/40 space-y-6 sticky top-28 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Pilih Jenis Tiket</h3>

            {/* Ticket Options */}
            <div className="space-y-3">
              <div
                onClick={() => setSelectedTicket('regular')}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  selectedTicket === 'regular'
                    ? 'border-indigo-500 bg-indigo-600/15'
                    : 'border-slate-800 glass-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">Tiket Regular</span>
                  <span className="font-extrabold text-sm text-emerald-400">Rp 250.000</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Akses semua stage seminar & sertifikat digital</p>
              </div>

              <div
                onClick={() => setSelectedTicket('vip')}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  selectedTicket === 'vip'
                    ? 'border-purple-500 bg-purple-600/15'
                    : 'border-slate-800 glass-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">Tiket VIP Pass</span>
                  <span className="font-extrabold text-sm text-purple-400">Rp 650.000</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Sertifikat + Networking Lunch + Front Seat VIP</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-slate-300">Jumlah Tiket</span>
              <div className="flex items-center gap-3 glass-card px-3 py-1.5 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-slate-400 hover:text-white font-bold px-2"
                >
                  -
                </button>
                <span className="text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-slate-400 hover:text-white font-bold px-2"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price & Action */}
            <div className="border-t border-slate-800 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Pembayaran</span>
                <span className="text-lg font-black text-white">
                  Rp {(selectedTicket === 'regular' ? 250000 * quantity : 650000 * quantity).toLocaleString('id-ID')}
                </span>
              </div>

              <button
                onClick={handleBooking}
                className="w-full gradient-btn py-3.5 rounded-xl font-bold text-sm text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                Beli Tiket Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
