import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Sparkles, Tag, ArrowRight, ShieldCheck, Zap, QrCode } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Semua Event', icon: '🔥' },
  { id: 'music', label: 'Konser Musik', icon: '🎵' },
  { id: 'tech', label: 'Teknologi & AI', icon: '💻' },
  { id: 'workshop', label: 'Workshop & Edukasi', icon: '🎨' },
  { id: 'sports', label: 'Olahraga', icon: '⚽' },
  { id: 'business', label: 'Bisnis & Startup', icon: '📈' },
];

const MOCK_EVENTS = [
  {
    id: '1',
    title: 'IndoTech Summit 2026: The Future of AI',
    category: 'Teknologi & AI',
    date: '15 Oktober 2026',
    location: 'Jakarta Convention Center (JCC)',
    price: 'Rp 250.000',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
    organizer: 'TechAsia Media',
    tag: 'POPULER',
  },
  {
    id: '2',
    title: 'Soundwave Festival 2026',
    category: 'Konser Musik',
    date: '28 November 2026',
    location: 'GBK Senayan Outdoor, Jakarta',
    price: 'Rp 450.000',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    organizer: 'LiveNation Indo',
    tag: 'BEST SELLER',
  },
  {
    id: '3',
    title: 'Creative UI/UX Masterclass & Design Systems',
    category: 'Workshop & Edukasi',
    date: '05 November 2026',
    location: 'Online via Zoom HD',
    price: 'Rp 150.000',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80',
    organizer: 'DesignWorks Studio',
    tag: 'ONLINE',
  },
  {
    id: '4',
    title: 'Indonesia Founder & Investor Meetup',
    category: 'Bisnis & Startup',
    date: '20 Desember 2026',
    location: 'BSD Green Office Park, Tangerang',
    price: 'Gratis',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80',
    organizer: 'VentureHub ID',
    tag: 'FREE',
  },
];

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20">
        {/* Background Decorative Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Platform Tiket Digital Generasi Baru
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-none max-w-4xl mx-auto">
            Temukan Event Impian & Beli Tiket <span className="gradient-text">Tanpa Antre</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Platform ticketing resmi dengan verifikasi instant, E-Ticket QR Code interaktif, dan sistem pembayaran terintegrasi paling transparan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="gradient-btn w-full sm:w-auto px-8 py-4 rounded-2xl text-white font-bold text-base shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 hover:scale-105 transition-all"
            >
              Mulai Sekarang Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#events"
              className="w-full sm:w-auto glass-card px-8 py-4 rounded-2xl text-slate-200 font-semibold text-base hover:bg-slate-800/80 transition-all text-center"
            >
              Jelajah Katalog Event
            </a>
          </div>

          {/* Features Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto text-left">
            <div className="glass-card p-5 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Verifikasi OTP Instan</h3>
              <p className="text-xs text-slate-400">Akun terverifikasi dengan kode OTP hemat waktu dan menjamin keamanan transaksi.</p>
            </div>
            <div className="glass-card p-5 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">E-Ticket QR Auto-Gen</h3>
              <p className="text-xs text-slate-400">Setiap tiket dilengkapi QR Code unik yang langsung siap discan di venue acara.</p>
            </div>
            <div className="glass-card p-5 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">100% Anti-Calo</h3>
              <p className="text-xs text-slate-400">Sistem keamanan tokenisasi mencegah pemalsuan tiket dan calo pihak ketiga.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Event Mendatang</h2>
            <p className="text-sm text-slate-400">Pilih dari berbagai kategori event menarik yang diselenggarakan minggu ini.</p>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'gradient-btn text-white shadow-lg shadow-indigo-600/30'
                  : 'glass-card text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_EVENTS.map((event) => (
            <div key={event.id} className="glass-card rounded-3xl overflow-hidden group flex flex-col justify-between">
              <div>
                {/* Image Banner */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-indigo-300 border border-slate-700">
                    {event.tag}
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                    <Tag className="w-3.5 h-3.5" />
                    {event.category}
                  </div>
                  <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-indigo-300 transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-slate-400">Mulai dari</span>
                  <span className="text-sm font-extrabold text-emerald-400">{event.price}</span>
                </div>
                <Link
                  to={`/events/${event.id}`}
                  className="px-3.5 py-2 rounded-xl glass-card hover:bg-indigo-600 text-xs font-semibold text-white transition-colors"
                >
                  Beli Tiket
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
