import React from 'react';
import { Ticket, Heart, Globe, Share2, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/60">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight gradient-text">EVTIK</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform manajemen event dan tiket digital paling aman, instan, dan terpercaya di Indonesia.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Navigasi</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Jelajah Event</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Kategori Populer</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Cara Beli Tiket</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Jadi Penyelenggara</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Dukungan & Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Pusat Bantuan</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Hubungi Kami</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Ikuti Kami</h4>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EVTIK Digital Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for digital event community
          </p>
        </div>
      </div>
    </footer>
  );
};
